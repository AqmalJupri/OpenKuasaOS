// tests/people-payslip-employer-rows.test.tsx
// The payslip's employer contributions section: the three shares, their total and the
// cost to the employer when the payslip records them, and only a notice when it does not
// (issue #403). A payslip paid before the shares were worked out has zeros that are not
// figures, so none of them may be shown as if nothing were owed.
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { PayslipLayout } from '@/components/people/payslip-rows';
import { EMPLOYER_NOT_RECORDED } from '@/lib/people/payroll';
import type { Payslip } from '@/lib/people/types';

const slip = (over: Partial<Payslip> = {}): Payslip => ({
  id: 'p1',
  employee_id: 'e1',
  employee_name: 'Aisyah',
  payroll_run_id: 'r1',
  period_month: '2026-10-01',
  basic_cents: 500_000,
  gross_cents: 500_000,
  epf_cents: 55_000,
  socso_cents: 2_500,
  eis_cents: 1_000,
  epf_employer_cents: 65_000,
  socso_employer_cents: 8_750,
  eis_employer_cents: 1_000,
  employer_recorded: true,
  pcb_cents: 0,
  other_deductions_cents: 0,
  net_cents: 441_500,
  set_by_hr: [],
  lines: [],
  status: 'paid',
  ...over,
});

/** The employer section's markup only, so a figure elsewhere on the payslip cannot satisfy a check. */
function employerSection(p: Payslip): string {
  const html = renderToStaticMarkup(<PayslipLayout payslip={p} />);
  const start = html.indexOf('aria-label="Employer contributions"');
  expect(start).toBeGreaterThan(-1);
  return html.slice(start, html.indexOf('</section>', start));
}

describe('the payslip employer contributions section', () => {
  test('recorded: the three shares, their total and the cost to the employer', () => {
    const html = employerSection(slip());
    for (const text of ['EPF', 'SOCSO', 'EIS', 'RM 650.00', 'RM 87.50', 'RM 10.00']) expect(html).toContain(text);
    expect(html).toContain('Total employer contributions');
    expect(html).toContain('RM 747.50');
    expect(html).toContain('Cost to employer');
    expect(html).toContain('RM 5,747.50');
    expect(html).not.toContain(EMPLOYER_NOT_RECORDED.slice(0, 12));
  });

  test('recorded and genuinely zero (a month of unpaid leave): the zeros are shown as figures', () => {
    const html = employerSection(
      slip({ gross_cents: 0, net_cents: 0, epf_cents: 0, socso_cents: 0, eis_cents: 0,
        epf_employer_cents: 0, socso_employer_cents: 0, eis_employer_cents: 0 }),
    );
    expect(html).toContain('Total employer contributions');
    expect(html).toContain('RM 0.00');
    expect(html).not.toContain('Not recorded');
  });

  test('not recorded: only the notice, no rows, no total and no cost', () => {
    const html = employerSection(
      slip({ employer_recorded: false, epf_employer_cents: 0, socso_employer_cents: 0, eis_employer_cents: 0 }),
    );
    expect(html).toContain(EMPLOYER_NOT_RECORDED);
    for (const text of ['EPF', 'SOCSO', 'EIS', 'RM ', 'Total employer contributions', 'Cost to employer']) {
      expect(html, text).not.toContain(text);
    }
  });
});
