import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INVOICE_MESSAGES, setEInvoice, setEInvoiceInput, voidInvoice } from '@/lib/finance/invoices';
import {
  markPaymentPaid,
  recordPaymentIn,
  recordPaymentInInput,
  recordPaymentOut,
  recordPaymentOutInput,
} from '@/lib/finance/money';
import { fakeFinance } from './setup/fake-finance';

const ID = '33333333-3333-4333-8333-333333333333';
const TXN = '55555555-5555-4555-8555-555555555555';
const ACCOUNT = '66666666-6666-4666-8666-666666666666';
const LOWER = 'abcdefab-cdef-4abc-8def-abcdefabcdef';
const UPPER = LOWER.toUpperCase();

let logged: ReturnType<typeof vi.spyOn>;
beforeEach(() => { logged = vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => { logged.mockRestore(); });

describe('setEInvoiceInput', () => {
  const first = (value: unknown) => setEInvoiceInput.safeParse(value).error?.issues[0]?.message;

  it('takes one of the four statuses and nothing else', () => {
    for (const einvoice_status of ['none', 'pending', 'validated', 'rejected']) {
      expect(setEInvoiceInput.safeParse({ id: ID, einvoice_status }).success, einvoice_status).toBe(true);
    }
    expect(first({ id: ID, einvoice_status: 'submitted' })).toBe('Choose an e-Invois status.');
    expect(first({ id: ID })).toBe('Choose an e-Invois status.');
  });
  it('trims the UUID, stores an empty box as null, and keeps it to 100 characters', () => {
    expect(setEInvoiceInput.parse({ id: ID, einvoice_status: 'validated', einvoice_uuid: ' F9D425P6DS7D8IU ' })).toEqual({
      id: ID,
      einvoice_status: 'validated',
      einvoice_uuid: 'F9D425P6DS7D8IU',
    });
    expect(setEInvoiceInput.parse({ id: ID, einvoice_status: 'pending', einvoice_uuid: '   ' }).einvoice_uuid).toBeNull();
    expect(setEInvoiceInput.parse({ id: ID, einvoice_status: 'pending' }).einvoice_uuid).toBeNull();
    expect(first({ id: ID, einvoice_status: 'validated', einvoice_uuid: 'x'.repeat(101) })).toBe('Keep the UUID to 100 characters or fewer.');
    expect(first({ id: ID, einvoice_status: 'validated', einvoice_uuid: 'x'.repeat(100) })).toBeUndefined();
  });
  it('refuses a UUID with no status, after trimming', () => {
    expect(first({ id: ID, einvoice_status: 'none', einvoice_uuid: 'F9D425P6DS7D8IU' })).toBe(
      'An invoice with no e-Invois status has no UUID. Clear the UUID, or choose a status.',
    );
    expect(first({ id: ID, einvoice_status: 'none', einvoice_uuid: '  ' })).toBeUndefined();
  });
  it('asks for a real invoice id and has no place for anything else on the invoice', () => {
    expect(first({ id: 'nope', einvoice_status: 'none' })).toBe('That invoice no longer exists.');
    const parsed = setEInvoiceInput.parse({ id: ID, einvoice_status: 'pending', status: 'void', invoice_no: 'INV-1', org_id: 'x' });
    expect(Object.keys(parsed).sort()).toEqual(['einvoice_status', 'einvoice_uuid', 'id']);
  });
});

describe('setEInvoice', () => {
  const input = { id: ID, einvoice_status: 'validated' as const, einvoice_uuid: 'F9D425P6DS7D8IU' };

  it('changes only the two e-Invois columns and updated_at, scoped to the workspace', async () => {
    const { ctx, calls } = fakeFinance({ data: { id: ID }, error: null });
    expect(await setEInvoice(ctx, input)).toEqual({ ok: true, data: { id: ID } });
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ name: 'finance_invoices', op: 'update', filters: { id: ID, org_id: 'org-1' } });
    expect(Object.keys(calls[0].values!).sort()).toEqual(['einvoice_status', 'einvoice_uuid', 'updated_at']);
    expect(calls[0].values).toMatchObject({ einvoice_status: 'validated', einvoice_uuid: 'F9D425P6DS7D8IU' });
  });
  it('clears the UUID when the status goes back to none', async () => {
    const { ctx, calls } = fakeFinance({ data: { id: ID }, error: null });
    await setEInvoice(ctx, { id: ID, einvoice_status: 'none', einvoice_uuid: '' });
    expect(calls[0].values).toMatchObject({ einvoice_status: 'none', einvoice_uuid: null });
  });
  it('says a draft has no e-Invois yet, a voided invoice can no longer be changed, and a missing one is gone', async () => {
    const refused = async (code: string) => setEInvoice(fakeFinance({ data: null, error: { code } }).ctx, input);
    expect(await refused('23514')).toEqual({ ok: false, error: 'e-Invois details can be recorded once the invoice is posted.' });
    expect(await refused('FIN01')).toEqual({ ok: false, error: 'This invoice has been posted or voided, so that can no longer be done.' });
    expect(await refused('42501')).toEqual({ ok: false, error: 'You do not have permission to make changes here.' });
    expect(await setEInvoice(fakeFinance({ data: null, error: null }).ctx, input)).toEqual({ ok: false, error: 'That invoice no longer exists.' });
    expect(logged).not.toHaveBeenCalled();
  });
  it('hides any other database error behind the general message and logs it', async () => {
    const { ctx } = fakeFinance({ data: null, error: { code: 'XX000' } });
    expect(await setEInvoice(ctx, input)).toEqual({ ok: false, error: 'That change could not be saved. Please try again.' });
    expect(logged).toHaveBeenCalled();
  });
});

describe('the sentence for an invoice that can no longer be changed', () => {
  it('never tells a person to void what they have just tried to void', async () => {
    // Voiding an invoice that someone else voided a moment ago is FIN01.
    const { ctx } = fakeFinance({ data: null, error: { code: 'FIN01' } });
    const result = await voidInvoice(ctx, { id: ID });
    expect(result).toEqual({ ok: false, error: INVOICE_MESSAGES.locked });
    expect(INVOICE_MESSAGES.locked).not.toMatch(/void it/i);
  });
  it('says where the payments and the refunds of an invoice are voided', () => {
    // A receipt cannot be deleted, so deleting is offered for refunds only: a pending refund has no void.
    expect(INVOICE_MESSAGES.hasPayments).toBe(
      'This invoice has payments or refunds. Void the payments on Payments In, and void or delete the refunds on Refunds, before voiding it.',
    );
    expect(INVOICE_MESSAGES.hasPayments).not.toMatch(/delete the payments/i);
  });
  it('has its own sentence for an invoice that credit notes hold', async () => {
    const { ctx } = fakeFinance({ data: null, error: { code: 'FIN12' } });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({
      ok: false,
      error: 'This invoice has credit notes. Void them on Credit Notes, or delete the drafts, before voiding it.',
    });
  });
});

describe('the same document twice on one payment', () => {
  const payment = { account_id: ACCOUNT, txn_date: '2026-10-05', method: 'fpx' as const };
  const firstIn = (value: unknown) => recordPaymentInInput.safeParse(value).error?.issues[0]?.message;
  const firstOut = (value: unknown) => recordPaymentOutInput.safeParse(value).error?.issues[0]?.message;

  it('is refused for an invoice whatever the capitals of its id', () => {
    const allocations = [{ invoice_id: LOWER, amount: 1 }, { invoice_id: UPPER, amount: 2 }];
    expect(firstIn({ ...payment, allocations })).toBe('Each invoice can appear once on a payment.');
    expect(firstIn({ ...payment, allocations: [allocations[1]] })).toBeUndefined();
  });
  it('is refused for a bill whatever the capitals of its id', () => {
    const allocations = [{ bill_id: UPPER, amount: 1 }, { bill_id: LOWER, amount: 2 }];
    expect(firstOut({ ...payment, allocations })).toBe('Each bill can appear once on a payment.');
    expect(firstOut({ ...payment, allocations: [allocations[0]] })).toBeUndefined();
  });
  it('is worded the same way when the database is the one to refuse it', async () => {
    const duplicate = { data: null, error: { code: '23505' } };
    expect(await recordPaymentIn(fakeFinance(duplicate).ctx, { ...payment, allocations: [{ invoice_id: LOWER, amount: 1 }] })).toEqual({
      ok: false,
      error: 'Each invoice can appear once on a payment.',
    });
    expect(await recordPaymentOut(fakeFinance(duplicate).ctx, { ...payment, allocations: [{ bill_id: LOWER, amount: 1 }] })).toEqual({
      ok: false,
      error: 'Each bill can appear once on a payment.',
    });
    expect(logged).not.toHaveBeenCalled();
  });
  it('is not what a unique violation means when a payment is marked paid', async () => {
    const { ctx } = fakeFinance({ data: null, error: { code: '23505' } });
    expect(await markPaymentPaid(ctx, { id: TXN, paid_on: '2026-10-09' })).toEqual({
      ok: false,
      error: 'That change could not be saved. Please try again.',
    });
    expect(logged).toHaveBeenCalled();
  });
});

describe('voiding an invoice on a return already marked filed', () => {
  const SEPT = '1 Sep – 31 Oct 2026';
  const FILED = `This invoice is on the ${SEPT} service tax return, which is marked filed. Issue a credit note instead. If the invoice should never have been issued, take the filed mark off the return, void the invoice, and file an amended return (Pindaan).`;
  const line = (tax_type: string | null, sst_rate: number, sst_amount_myr: number) => ({
    id: 'l1',
    invoice_id: ID,
    sst_rate,
    tax_type,
    sst_amount_myr,
  });
  const filed = (tax_type: string, period_start = '2026-09-01') => ({ tax_type, period_start, filed_on: '2026-11-05' });
  const books = (o: { lines?: ReturnType<typeof line>[]; marks?: Record<string, unknown>[]; start?: number; noSettings?: boolean; marksError?: unknown; status?: string } = {}) =>
    fakeFinance((call) => {
      if (call.name === 'finance_invoices' && call.op === 'select') {
        return { data: { id: ID, invoice_date: '2026-09-10', status: o.status ?? 'posted' }, error: null };
      }
      if (call.name === 'finance_invoice_lines') return { data: o.lines ?? [], error: null };
      if (call.name === 'finance_sst_settings') {
        return { data: o.noSettings ? null : { period_start_month: o.start ?? 1 }, error: null };
      }
      if (call.name === 'finance_sst_returns') {
        if (o.marksError) return { data: null, error: o.marksError };
        return { data: (o.marks ?? []).filter((m) => m.tax_type === call.filters.tax_type), error: null };
      }
      return { data: { id: ID }, error: null };
    });

  it('refuses the void, names the period, and gives both ways out', async () => {
    const { ctx, calls } = books({ lines: [line('service', 6, 300)], marks: [filed('service')] });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({ ok: false, error: FILED });
    expect(calls.some((c) => c.op === 'update')).toBe(false);
    expect(logged).not.toHaveBeenCalled();
  });

  it('says SST when the invoice is on both filed returns', async () => {
    const { ctx } = books({
      lines: [line('service', 6, 300), line('sales', 10, 500)],
      marks: [filed('service'), filed('sales')],
    });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({
      ok: false,
      error: FILED.replace('service tax return', 'SST return'),
    });
  });

  it('voids once the period is not the one marked filed', async () => {
    const { ctx, calls } = books({ lines: [line('service', 6, 300)], marks: [filed('service', '2026-07-01')] });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({ ok: true, data: { id: ID } });
    const update = calls.find((c) => c.op === 'update');
    expect(update?.values).toMatchObject({ status: 'void' });
  });

  it('holds the void only for the tax the invoice carries', async () => {
    const { ctx } = books({ lines: [line('service', 6, 300)], marks: [filed('sales')] });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({ ok: true, data: { id: ID } });
  });

  it('lets an invoice with no SST be voided', async () => {
    const { ctx } = books({ lines: [line('none', 0, 0)], marks: [filed('service')] });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({ ok: true, data: { id: ID } });
  });

  it('leaves a draft or an already void invoice to the database’s own refusal', async () => {
    for (const status of ['draft', 'void']) {
      const { ctx } = books({ lines: [line('service', 6, 300)], marks: [filed('service')], status });
      expect(await voidInvoice(ctx, { id: ID }), status).toEqual({ ok: true, data: { id: ID } });
    }
  });

  it('takes the period from the workspace’s own start month', async () => {
    // Starting in February, 10 September falls in 1 Aug – 30 Sep 2026, so a September mark does not hold it.
    const { ctx } = books({ lines: [line('service', 6, 300)], marks: [filed('service')], start: 2 });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({ ok: true, data: { id: ID } });
  });

  it('voids freely when the workspace has never saved SST settings', async () => {
    const { ctx } = books({ lines: [line('service', 6, 300)], marks: [filed('service')], noSettings: true });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({ ok: true, data: { id: ID } });
  });

  it('refuses rather than rewrite a filed return it could not read', async () => {
    const { ctx, calls } = books({ lines: [line('service', 6, 300)], marksError: { code: 'XX000' } });
    expect(await voidInvoice(ctx, { id: ID })).toEqual({ ok: false, error: 'That change could not be saved. Please try again.' });
    expect(calls.some((c) => c.op === 'update')).toBe(false);
    expect(logged).toHaveBeenCalled();
  });
});
