import {
  applySupplierCreditAction,
  deleteSupplierCreditNoteAction,
  issueSupplierCreditNoteAction,
  saveAndIssueSupplierCreditNoteAction,
  saveSupplierCreditNoteAction,
  unapplySupplierCreditAction,
  voidSupplierCreditNoteAction,
} from '@/app/(app)/finance/actions';
import { type SupplierCreditActions, SupplierCreditNotesView } from '@/components/finance/supplier-credit-notes-view';
import { can } from '@/lib/auth/permissions';
import { getViewer, hasSupabaseEnv } from '@/lib/auth/viewer';
import { listBills } from '@/lib/finance/bills';
import { listPaymentsOut } from '@/lib/finance/money';
import { heldByBill } from '@/lib/finance/payment-form';
import { supplierCreditView } from '@/lib/finance/supplier-credit-note-form';
import { listSupplierCreditNotes } from '@/lib/finance/supplier-credit-notes';
import { todayUtc } from '@/lib/finance/view-helpers';
import { createClient } from '@/lib/supabase/server';
import { SAMPLE_TODAY } from './sales-sample';
import { SAMPLE_SUPPLIER_CREDITS } from './supplier-credit-sample';

const ACTIONS: SupplierCreditActions = {
  save: saveSupplierCreditNoteAction,
  saveAndIssue: saveAndIssueSupplierCreditNoteAction,
  issue: issueSupplierCreditNoteAction,
  voidNote: voidSupplierCreditNoteAction,
  remove: deleteSupplierCreditNoteAction,
  apply: applySupplierCreditAction,
  unapply: unapplySupplierCreditAction,
};

/**
 * Every supplier credit note of the workspace. Anyone who may edit saves and deletes drafts; issuing, voiding,
 * applying credit and taking it off are an owner's or admin's (`sign-off-finance`), as the database enforces. A
 * viewer and the demo workspace read.
 */
export default async function SupplierCreditNotesScreen() {
  if (!hasSupabaseEnv()) {
    return <SupplierCreditNotesView rows={SAMPLE_SUPPLIER_CREDITS} view={supplierCreditView(SAMPLE_SUPPLIER_CREDITS, SAMPLE_TODAY)} />;
  }
  const viewer = await getViewer();
  const ctx = { client: await createClient(), orgId: viewer.orgId };
  const canEdit = !viewer.isDemo && can(viewer.role, 'edit-data');
  // The form offers posted bills, and applying credit offers the bills that still owe after payments not yet made:
  // read only for someone who has the form.
  const [rows, bills, payments] = await Promise.all([
    listSupplierCreditNotes(ctx),
    canEdit ? listBills(ctx) : [],
    canEdit ? listPaymentsOut(ctx) : [],
  ]);
  return (
    <SupplierCreditNotesView
      rows={rows}
      view={supplierCreditView(rows, todayUtc())}
      writer={canEdit ? { actions: ACTIONS, canSignOff: can(viewer.role, 'sign-off-finance'), bills, held: heldByBill(payments) } : undefined}
    />
  );
}
