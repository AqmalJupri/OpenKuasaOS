import { describe, expect, it } from 'vitest';
import type { BillListRow } from '@/lib/finance/bills';
import {
  applyCreditError,
  appliedText,
  creditTargets,
  creditableBills,
  defaultApplyAmount,
  filterSupplierCredits,
  newSupplierCreditForm,
  supplierCreditActions,
  supplierCreditFormError,
  supplierCreditPayload,
  supplierCreditView,
  supplierCreditsCsv,
} from '@/lib/finance/supplier-credit-note-form';
import type { SupplierCreditNoteRow } from '@/lib/finance/supplier-credit-notes';

const B1 = '11111111-1111-4111-8111-111111111111';
const B2 = '22222222-2222-4222-8222-222222222222';
const B3 = '33333333-3333-4333-8333-333333333333';
const N1 = '44444444-4444-4444-8444-444444444444';

function bill(over: Partial<BillListRow> = {}): BillListRow {
  return {
    id: B1, bill_no: 'BILL-0001', supplier_id: 'lim', supplier_name: 'Lim Hardware', bill_date: '2026-10-01', due_date: '2026-10-31',
    total: 500, paid: 0, balance: 500, display_status: 'pending', purchase_order_id: null, purchase_order_no: null,
    category_id: null, category_name: null, currency: 'MYR', fx_rate: 1, fx_rate_text: '1.0000000000', fx_rate_source: null,
    fx_rate_date: null, fx_rate_provider: null, fx_rate_reference: null, subtotal_myr: 500, sst_myr: 0, total_myr: 500, balance_myr: 500,
    ...over,
  };
}

function note(over: Partial<SupplierCreditNoteRow> = {}): SupplierCreditNoteRow {
  return {
    id: N1, credit_note_no: 'SCN-0001', bill_id: B1, bill_no: 'BILL-0001', supplier_id: 'lim', supplier_name: 'Lim Hardware',
    credit_date: '2026-10-05', reason: 'overpaid', amount: 200, supplier_ref: null, notes: null, status: 'issued',
    applied: 0, open_amount: 200, applications: [], ...over,
  };
}

describe('creditableBills', () => {
  it('offers posted ringgit bills with something left to credit, by supplier and number', () => {
    const bills = [
      bill({ id: B2, bill_no: 'BILL-0010', supplier_name: 'Ah Seng' }),
      bill(),
      bill({ id: B3, display_status: 'draft', bill_no: null }),
      bill({ id: 'usd', currency: 'USD' }),
      bill({ id: 'void', display_status: 'void' }),
    ];
    const offered = creditableBills(bills, [note({ amount: 500 })]);
    // BILL-0001 is fully credited by an issued note; a draft note would not count.
    expect(offered.map((b) => b.id)).toEqual([B2]);
    expect(creditableBills(bills, [note({ amount: 500, status: 'draft' })]).map((b) => b.id)).toEqual([B2, B1]);
    // The form's own bill stays, with nothing left, so it can say so.
    expect(creditableBills(bills, [note({ amount: 500 })], B1).find((b) => b.id === B1)).toMatchObject({ credited: 500, creditable: 0 });
  });
});

describe('the form', () => {
  const offered = creditableBills([bill()], [note({ amount: 100 })]);
  it('chooses the bill it was opened from, when it can still take a note', () => {
    expect(newSupplierCreditForm(offered, '2026-10-10', B1).billId).toBe(B1);
    expect(newSupplierCreditForm(offered, '2026-10-10', B2).billId).toBe('');
  });
  it('says what is wrong, ending with more than the bill has left', () => {
    const form = { ...newSupplierCreditForm(offered, '2026-10-10', B1), reason: 'returned_goods' as const, amount: '401' };
    expect(supplierCreditFormError({ ...form, reason: '' }, offered)).toBe('Choose a reason.');
    expect(supplierCreditFormError(form, offered)).toBe('That is more than this bill has left to credit.');
    expect(supplierCreditFormError({ ...form, amount: '400' }, offered)).toBeNull();
    expect(supplierCreditPayload({ ...form, amount: 'abc' }).amount).toBeNaN();
  });
});

describe('applying credit', () => {
  const bills = [
    bill(),
    bill({ id: B2, bill_no: 'BILL-0005', due_date: '2026-11-20', balance: 80 }),
    bill({ id: B3, bill_no: 'BILL-0004', due_date: '2026-11-05', balance: 300 }),
    bill({ id: 'other', supplier_id: 'printhub' }),
    bill({ id: 'paid', display_status: 'paid', balance: 0 }),
  ];
  it('offers the supplier’s bills that still owe, after payments not yet made, oldest due first, not ones already holding it', () => {
    const n = note({ applications: [{ bill_id: B1, bill_no: 'BILL-0001', amount: 50 }] });
    expect(creditTargets(n, bills).map((t) => t.id)).toEqual([B3, B2]);
    expect(creditTargets(n, bills, { [B3]: 300 }).map((t) => t.id)).toEqual([B2]);
  });
  it('starts at the smaller of the open credit and what the bill owes, and refuses more', () => {
    const n = note({ open_amount: 150 });
    const targets = creditTargets(n, bills);
    expect(defaultApplyAmount(n, targets.find((t) => t.id === B2))).toBe('80.00');
    expect(defaultApplyAmount(n, targets.find((t) => t.id === B3))).toBe('150.00');
    expect(applyCreditError(n, targets, B2, '80.01')).toBe('That is more than the credit note has left, or more than the bill still owes.');
    expect(applyCreditError(n, targets, '', '10')).toBe('Choose the bill to put this credit on.');
    expect(applyCreditError(n, targets, B3, '150')).toBeNull();
  });
});

describe('the row', () => {
  it('offers drafts to anyone who may write, and issuing, applying, taking off and voiding to an owner or admin', () => {
    expect(supplierCreditActions(note({ status: 'draft' }), false, true)).toEqual(['edit', 'delete']);
    expect(supplierCreditActions(note({ status: 'draft' }), true, true)).toEqual(['edit', 'issue', 'delete']);
    expect(supplierCreditActions(note(), false, true)).toEqual([]);
    expect(supplierCreditActions(note(), true, true)).toEqual(['apply', 'void']);
    expect(supplierCreditActions(note(), true, false)).toEqual(['void']);
    const moved = note({ open_amount: 0, applications: [{ bill_id: B1, bill_no: 'BILL-0001', amount: 150 }, { bill_id: B2, bill_no: 'BILL-0005', amount: 50 }] });
    expect(supplierCreditActions(moved, true, true)).toEqual(['unapply', 'void']);
    expect(supplierCreditActions(note({ status: 'void' }), true, true)).toEqual([]);
    expect(appliedText(moved)).toBe('BILL-0001 RM 150.00, BILL-0005 RM 50.00');
  });
});

describe('the screen', () => {
  const rows = [
    note({ credit_date: '2026-10-05', amount: 200, open_amount: 50 }),
    note({ id: 'b', credit_date: '2026-09-02', reason: 'returned_goods', amount: 100, open_amount: 0, supplier_ref: 'LH/CN/44' }),
    note({ id: 'c', status: 'draft', credit_note_no: null, open_amount: 0 }),
    note({ id: 'd', status: 'void', open_amount: 0 }),
  ];
  it('counts issued notes only', () => {
    const view = supplierCreditView(rows, '2026-10-10');
    expect(view.stats.map((s) => [s.label, s.value])).toEqual([
      ['Credited (MTD)', 'RM 200'],
      ['Open credit', 'RM 50'],
      ['Issued', '2'],
      ['Drafts', '1'],
    ]);
    expect(view.byReason.map((s) => [s.key, s.value])).toEqual([['overpaid', 200], ['returned_goods', 100]]);
  });
  it('filters by status and searches the supplier’s reference too', () => {
    expect(filterSupplierCredits(rows, '', 'open')).toHaveLength(3);
    expect(filterSupplierCredits(rows, 'lh/cn', 'open').map((n) => n.id)).toEqual(['b']);
  });
  it('exports applied and open for issued notes only', () => {
    const csv = supplierCreditsCsv(rows.slice(2, 3)).replace(/^\uFEFF/, '').replace(/\r/g, '');
    expect(csv.split('\n')[0]).toBe("No.,Date,Supplier,Bill,Supplier's ref.,Reason,Amount,Applied,Open,Status");
    expect(csv.split('\n')[1]).toBe(',2026-10-05,Lim Hardware,BILL-0001,,Overpaid,200,,,Draft');
  });
});
