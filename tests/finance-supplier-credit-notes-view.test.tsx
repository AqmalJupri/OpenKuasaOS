import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SUPPLIER_CREDIT_MEMBER_NOTE, type SupplierCreditActions, SupplierCreditNotesView } from '@/components/finance/supplier-credit-notes-view';
import { supplierCreditView } from '@/lib/finance/supplier-credit-note-form';
import { SAMPLE_SUPPLIER_CREDITS } from '@/screens/finance/supplier-credit-sample';

/** The Supplier Credit Notes screen as the server sends it, read as markup. */

const never = async () => ({ ok: false as const, error: 'unused' });
const actions: SupplierCreditActions = { save: never, saveAndIssue: never, issue: never, voidNote: never, remove: never, apply: never, unapply: never };
const view = supplierCreditView(SAMPLE_SUPPLIER_CREDITS, '2026-10-10');
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('Supplier Credit Notes', () => {
  it('lists every note with its bill, reason, applied and open, and where its credit went', () => {
    const html = text(renderToStaticMarkup(<SupplierCreditNotesView rows={SAMPLE_SUPPLIER_CREDITS} view={view} />));
    for (const heading of ['Against bill', 'Reason', 'Applied', 'Open']) expect(html).toContain(heading);
    expect(html).toContain('SCN-0001');
    expect(html).toContain('Theirs: LH/CN/2026/044');
    expect(html).toContain('BILL-0231 RM 420.00');
    expect(html).toContain('Returned goods');
    // A viewer gets no New button and no row menus.
    expect(html).not.toContain('New credit note');
    expect(html).not.toContain(SUPPLIER_CREDIT_MEMBER_NOTE);
  });

  it('tells a member who issues them, and gives an owner or admin no such note', () => {
    const member = text(
      renderToStaticMarkup(
        <SupplierCreditNotesView rows={SAMPLE_SUPPLIER_CREDITS} view={view} writer={{ actions, canSignOff: false, bills: [], held: {} }} />,
      ),
    );
    expect(member).toContain('New credit note');
    expect(member).toContain(SUPPLIER_CREDIT_MEMBER_NOTE);
    const owner = text(
      renderToStaticMarkup(
        <SupplierCreditNotesView rows={SAMPLE_SUPPLIER_CREDITS} view={view} writer={{ actions, canSignOff: true, bills: [], held: {} }} />,
      ),
    );
    expect(owner).not.toContain(SUPPLIER_CREDIT_MEMBER_NOTE);
  });
});
