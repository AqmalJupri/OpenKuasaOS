'use client';

import { type FormEvent, useId, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { BentoCard } from '@/components/bento/bento';
import { useFinanceAction } from '@/components/finance/use-finance-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BillListRow } from '@/lib/finance/bills';
import { rm } from '@/lib/finance/format';
import type { FinResult } from '@/lib/finance/result';
import {
  type SupplierCreditSaved,
  creditableBillLabel,
  creditableBills,
  newSupplierCreditForm,
  supplierCreditFormError,
  supplierCreditFormFromRow,
  supplierCreditPayload,
  supplierCreditSaved,
  supplierCreditSavedNotIssued,
} from '@/lib/finance/supplier-credit-note-form';
import {
  SUPPLIER_CREDIT_REASONS,
  SUPPLIER_CREDIT_REASON_LABELS,
  type SaveAndIssueSupplierCreditResult,
  type SupplierCreditNoteRow,
  type SupplierCreditReason,
} from '@/lib/finance/supplier-credit-notes';

export type SupplierCreditFormActions = {
  save: (input: unknown) => Promise<FinResult<{ id: string }>>;
  /** Saves the draft, then issues it. When only the issue was refused, the answer carries the draft's id. */
  saveAndIssue: (input: unknown) => Promise<SaveAndIssueSupplierCreditResult>;
};

/**
 * A new supplier credit note against one posted ringgit bill, or a draft being changed (`editing`). Saved as a
 * draft, or saved and issued in one go. Used on Supplier Credit Notes, and on Supplier Bills from a bill's Credit
 * note choice (`billId`). The rules are in src/lib/finance/supplier-credit-note-form.ts.
 */
export function SupplierCreditNoteFormCard({
  editing,
  bills,
  notes,
  today,
  billId,
  actions,
  onClose,
  onSaved,
}: {
  editing?: SupplierCreditNoteRow;
  /** Every bill of the workspace; the card offers the ones that can still take a credit note. */
  bills: BillListRow[];
  /** Every supplier credit note, to know what each bill's issued notes already come to. */
  notes: SupplierCreditNoteRow[];
  today: string;
  billId?: string;
  actions: SupplierCreditFormActions;
  onClose: () => void;
  /** Called instead of `onClose` once saved, where the page has something to say about it. */
  onSaved?: (saved: SupplierCreditSaved) => void;
}) {
  const id = useId();
  const [form, setForm] = useState(() =>
    editing ? supplierCreditFormFromRow(editing) : newSupplierCreditForm(creditableBills(bills, notes), today, billId),
  );
  const [issuing, setIssuing] = useState(false);
  const save = useFinanceAction();
  const edit: typeof setForm = (next) => {
    save.clear();
    setForm(next);
  };

  const offered = creditableBills(bills, notes, form.billId);
  const chosen = offered.find((b) => b.id === form.billId);

  const send = (issue: boolean) => {
    const problem = supplierCreditFormError(form, offered);
    if (problem) {
      save.fail(problem);
      return;
    }
    const payload = supplierCreditPayload(form);
    const what = supplierCreditSaved(form, offered, issue);
    const saved = () => (onSaved && what ? onSaved(what) : onClose());
    setIssuing(issue);
    if (!issue) {
      save.run(() => actions.save(payload), saved);
      return;
    }
    save.run(async () => {
      const result = await actions.saveAndIssue(payload);
      if (!result.ok && result.draftId) {
        const draftId = result.draftId;
        setForm((f) => ({ ...f, id: draftId }));
        return { ...result, error: supplierCreditSavedNotIssued(result.error) };
      }
      return result;
    }, saved);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(false);
  };

  const title = form.id ? 'Edit supplier credit note' : 'New supplier credit note';
  const subtitle = form.id ? 'A draft: it gets its number when it is issued' : 'Saved as a draft until it is issued';

  if (offered.length === 0) {
    return (
      <BentoCard title={title} subtitle={subtitle} icon={Plus} className="col-span-2 md:col-span-12">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            There is no bill to credit. A supplier credit note goes against a posted bill in ringgit, for no more than its
            total less what has already been credited.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={onClose} autoFocus data-finance-focus>
            Close
          </Button>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard title={title} subtitle={subtitle} icon={form.id ? FileText : Plus} className="col-span-2 md:col-span-12">
      <form onSubmit={submit} noValidate className="grid gap-3 md:grid-cols-12">
        <div className="space-y-1.5 md:col-span-6">
          <Label htmlFor={`${id}-bill`}>Against bill</Label>
          <Select value={chosen ? form.billId : ''} onValueChange={(v) => edit((f) => ({ ...f, billId: v }))}>
            <SelectTrigger id={`${id}-bill`} className="w-full" autoFocus data-finance-focus>
              <SelectValue placeholder="Choose a bill" />
            </SelectTrigger>
            <SelectContent>
              {offered.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {creditableBillLabel(b)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
            {chosen
              ? `Total ${rm(chosen.total)} · ${rm(chosen.credited)} already credited · ${rm(chosen.creditable)} left to credit`
              : 'A posted bill. What has been paid on it does not limit a credit note.'}
          </p>
        </div>
        <div className="space-y-1.5 md:col-span-3">
          <Label htmlFor={`${id}-date`}>Credit note date</Label>
          <Input id={`${id}-date`} type="date" value={form.date} required onChange={(e) => edit((f) => ({ ...f, date: e.target.value }))} />
        </div>
        <div className="space-y-1.5 md:col-span-3">
          <Label htmlFor={`${id}-amount`}>Amount (RM)</Label>
          <Input
            id={`${id}-amount`}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            className="text-right tabular-nums"
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            value={form.amount}
            onChange={(e) => edit((f) => ({ ...f, amount: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5 md:col-span-4">
          <Label htmlFor={`${id}-reason`}>Reason</Label>
          <Select value={form.reason} onValueChange={(v) => edit((f) => ({ ...f, reason: v as SupplierCreditReason }))}>
            <SelectTrigger id={`${id}-reason`} className="w-full">
              <SelectValue placeholder="Choose a reason" />
            </SelectTrigger>
            <SelectContent>
              {SUPPLIER_CREDIT_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {SUPPLIER_CREDIT_REASON_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 md:col-span-3">
          <Label htmlFor={`${id}-ref`}>Supplier&apos;s credit note no.</Label>
          <Input
            id={`${id}-ref`}
            value={form.supplierRef}
            maxLength={200}
            autoComplete="off"
            onChange={(e) => edit((f) => ({ ...f, supplierRef: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5 md:col-span-5">
          <Label htmlFor={`${id}-notes`}>Notes</Label>
          <Input
            id={`${id}-notes`}
            value={form.notes}
            maxLength={200}
            autoComplete="off"
            onChange={(e) => edit((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 md:col-span-12">
          <Button type="submit" size="sm" variant="outline" disabled={save.pending}>
            {save.pending && !issuing ? 'Saving…' : 'Save draft'}
          </Button>
          <Button type="button" size="sm" disabled={save.pending} onClick={() => send(true)}>
            {save.pending && issuing ? 'Issuing…' : 'Save and issue'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={save.pending}>
            Cancel
          </Button>
          {save.error ? (
            <p role="alert" className="text-sm text-destructive">
              {save.error}
            </p>
          ) : null}
        </div>
      </form>
    </BentoCard>
  );
}
