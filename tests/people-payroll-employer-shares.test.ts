// tests/people-payroll-employer-shares.test.ts
// The employer's EPF, SOCSO and EIS shares are worked out from the same rules table
// as the employee's, as a rate of wages, and never touch net pay (issue #403). They are
// estimates: PERKESO charges a fixed amount per wage band, tracked in #423.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { RUN_EMPLOYER_NOT_RECORDED, employerOf, payslipDetailModel, payrollModel, runEmployerLine } from '@/lib/people/payroll';
import type { PayrollRun, Payslip } from '@/lib/people/types';

const FILE = '20261128090000_people_payroll_employer_shares.sql';

/** The migration without its comment lines, so a promise in a comment cannot satisfy a check. */
const sql = readFileSync(join(process.cwd(), 'supabase/migrations', FILE), 'utf8')
  .split('\n')
  .filter((line) => !line.trimStart().startsWith('--'))
  .join('\n');

/** One function's header and body, from `create or replace function <name>(` to its `$$;`. */
function fn(qualified: string): string {
  const start = sql.indexOf(`create or replace function ${qualified}(`);
  expect(start, qualified).toBeGreaterThan(-1);
  return sql.slice(start, sql.indexOf('$$;', start));
}

/** The rows the migration seeds into the rules table, as `scheme payer citizenship from until wage_from rate cap round`. */
function seededRows(): string[] {
  return sql
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith("('"));
}

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
  status: 'pending',
  ...over,
});

describe('the rules table says who pays, and which wage band a row covers', () => {
  test('a payer column and a band from which a row applies, on the key', () => {
    expect(sql).toContain("add column payer text not null default 'employee' check (payer in ('employee', 'employer'))");
    expect(sql).toContain('add column wage_from_cents bigint not null default 0');
    expect(sql).toContain('add primary key (scheme, payer, citizenship, employee_from_age, wage_from_cents);');
  });

  test('every row already there stays an employee row in the band from zero, so no figure moves', () => {
    expect(sql).toContain("add column payer text not null default 'employee'");
    expect(sql).toContain('add column wage_from_cents bigint not null default 0');
    expect(sql).not.toMatch(/update public\.hr_statutory_rules set (rate|max_cents)/);
  });
});

describe('the employer rows', () => {
  const employer = () => seededRows().filter((row) => row.includes("'employer'"));

  test('employer EPF steps down at RM5,000: 13% to it, 12% from a sen above', () => {
    const citizen = employer().filter((row) => row.startsWith("('epf', 'employer', 'citizen'"));
    expect(citizen).toHaveLength(3);
    expect(citizen.some((row) => /\b0, 0\.13\b/.test(row))).toBe(true);
    expect(citizen.some((row) => /500001, 0\.12\b/.test(row))).toBe(true);
    // From 60 a citizen employer pays 4%, and nothing about a band above it.
    expect(citizen.some((row) => /\b60, 75, 0, 0\.04\b/.test(row))).toBe(true);
  });

  test('a permanent resident and a member before 1998 step down at 60 too, 6.5% then 6%', () => {
    for (const category of ['permanent_resident', 'non_citizen_before_1998']) {
      const rows = employer().filter((row) => row.includes(`'${category}'`));
      expect(rows.some((row) => /\b0, 60, 0, 0\.13\b/.test(row)), category).toBe(true);
      expect(rows.some((row) => /\b0, 60, 500001, 0\.12\b/.test(row)), category).toBe(true);
      expect(rows.some((row) => /\b60, 75, 0, 0\.065\b/.test(row)), category).toBe(true);
      expect(rows.some((row) => /\b60, 75, 500001, 0\.06\b/.test(row)), category).toBe(true);
    }
  });

  test('a non-citizen employer pays 2% at any age to 75', () => {
    const rows = employer().filter((row) => row.includes("'non_citizen'") && row.startsWith("('epf'"));
    expect(rows).toEqual([expect.stringMatching(/\('epf', 'employer', 'non_citizen', 0, 75, 0, 0\.02\b/)]);
  });

  test('the employer SOCSO share is the first category below 60 and 1.25% from 60, at the tables own ceilings', () => {
    const rows = employer().filter((row) => row.startsWith("('socso'"));
    // Every category pays the same employer share: a foreign worker is in the invalidity scheme too.
    expect(new Set(rows.map((row) => row.split(',')[2].trim())).size).toBe(4);
    expect(rows.filter((row) => /\b0, 60, 0, 0\.0175, 10415, 5\b/.test(row))).toHaveLength(4);
    expect(rows.filter((row) => /\b60, null, 0, 0\.0125, 7440, 5\b/.test(row))).toHaveLength(4);
  });

  test('the employer EIS share covers citizens and permanent residents from 18 to 60, and no one else', () => {
    const rows = employer().filter((row) => row.startsWith("('eis'"));
    expect(rows).toHaveLength(2);
    for (const row of rows) expect(row).toMatch(/\b18, 60, 0, 0\.002, 1190, 5\b/);
    expect(rows.some((row) => row.includes('non_citizen'))).toBe(false);
  });
});

describe('the proposal reads the payer and the wage band', () => {
  test('a payer argument, defaulted to the employee, on the one rule whose band the wage reaches', () => {
    const proposal = fn('private.hr_payroll_proposal');
    expect(proposal).toContain("p_payer text default 'employee'");
    expect(proposal).toContain("and s.payer = coalesce(p_payer, 'employee')");
    expect(proposal).toContain('and s.wage_from_cents <= coalesce(p_wage_cents, 0)');
    expect(proposal).toContain('order by s.wage_from_cents desc');
  });

  test('the employer SOCSO and EIS rows round to five sen before the ceiling, KWSP keeps the sen it always used', () => {
    const proposal = fn('private.hr_payroll_proposal');
    expect(proposal).toMatch(/round\(p_wage_cents \* s\.rate \/ s\.round_to_cents\) \* s\.round_to_cents/);
    expect(sql).toContain('add column round_to_cents smallint not null default 1');
  });

  test('the four arguments the check file already calls keep working', () => {
    // The older signature is dropped, so a four argument call resolves to the five argument one through its default.
    expect(sql).toContain('drop function if exists private.hr_payroll_proposal(text, bigint, int, text);');
    expect(sql).not.toContain('create function private.hr_payroll_proposal');
  });
});

describe('a payslip records the employer shares, and net pay is not one of them', () => {
  test('three columns of their own, none inside the generated net pay', () => {
    for (const column of ['epf_employer_cents', 'socso_employer_cents', 'eis_employer_cents']) {
      expect(sql).toContain(`add column ${column} bigint not null default 0 check (${column} >= 0)`);
      expect(sql).toContain(`'${column}', p_slip.${column}`);
    }
    // Net pay is a generated column of the five employee figures: this migration must not redefine it, or an
    // employer figure would be taken off what the employee receives.
    expect(sql).not.toMatch(/generated always as|drop column net_cents|add column net_cents/);
  });

  test('each one is worked out on the wage base of its own scheme, and never typed over', () => {
    const refresh = fn('private.hr_payroll_refresh_payslip');
    expect(refresh).toContain("epf_employer_cents = private.hr_payroll_proposal('epf', epf_wages, age_years, category, 'employer')");
    expect(refresh).toContain("socso_employer_cents = private.hr_payroll_proposal('socso', socso_wages, age_years, category, 'employer')");
    expect(refresh).toContain("eis_employer_cents = private.hr_payroll_proposal('eis', socso_wages, age_years, category, 'employer')");
    // set_by_hr is HR's own figure for what the employee pays; the employer's share is not part of it.
    expect(refresh).not.toMatch(/'employer' = any/);
  });

  test('the drafts on record are worked out again, and a paid payslip is left alone', () => {
    expect(sql).toMatch(/where r\.status = 'draft'/);
  });

  test('whether the shares were worked out is recorded on the row, false until the payslip function sets it', () => {
    expect(sql).toContain('add column employer_recorded boolean not null default false');
    expect(fn('private.hr_payroll_refresh_payslip')).toContain('employer_recorded = true');
    expect(fn('private.hr_payslip_json')).toContain("'employer_recorded', p_slip.employer_recorded");
    // Only that function sets it: no update marks rows already there, so a paid payslip from before stays not recorded.
    expect(sql.split('employer_recorded = true')).toHaveLength(2);
  });
});

describe('the app adds the employer shares up', () => {
  test('per payslip: EPF, SOCSO and EIS employer, and the pay as it was', () => {
    expect(employerOf(slip())).toBe(74_750);
    const detail = payslipDetailModel(slip());
    expect(detail.employer.map((f) => [f.label, f.amount_cents])).toEqual([
      ['EPF', 65_000],
      ['SOCSO', 8_750],
      ['EIS', 1_000],
    ]);
    expect(detail.employer_cents).toBe(74_750);
    // The employer's share is paid on top of gross pay, not taken out of it.
    expect(detail.net_cents).toBe(441_500);
    expect(detail.deductions_cents).toBe(58_500);
    expect(detail.cost_cents).toBe(574_750);
  });

  test('per run: one total, its parts, and a cost the deductions never include', () => {
    const runs: PayrollRun[] = [{ id: 'r1', period_month: '2026-10-01', status: 'draft', paid_at: null, paid_by_name: null }];
    const model = payrollModel(runs, [slip(), slip({ id: 'p2', employee_id: 'e2' })]);
    const latest = model.latest!;
    expect(latest.employer_cents).toBe(149_500);
    expect(model.employer.map((f) => [f.label, f.value])).toEqual([
      ['EPF', 130_000],
      ['SOCSO', 17_500],
      ['EIS', 2_000],
    ]);
    expect(latest.cost_cents).toBe(1_149_500);
    expect(latest.deductions_cents).toBe(117_000);
    expect(latest.net_cents).toBe(883_000);
  });

  test('whether the shares were recorded is the payslip\'s own fact, never guessed from the amounts', () => {
    const zero = { epf_employer_cents: 0, socso_employer_cents: 0, eis_employer_cents: 0 };
    // Paid before the shares were worked out: not recorded.
    expect(payslipDetailModel(slip({ status: 'paid', ...zero, employer_recorded: false })).employer_recorded).toBe(false);
    // A whole month of unpaid leave, paid since: gross 0 and genuinely no share, but recorded.
    const away = slip({ status: 'paid', ...zero, gross_cents: 0, net_cents: 0, epf_cents: 0, socso_cents: 0, eis_cents: 0 });
    expect(payslipDetailModel(away).employer_recorded).toBe(true);
    // The flag is read as it is, whatever the amounts and the status say.
    expect(payslipDetailModel(slip({ employer_recorded: false })).employer_recorded).toBe(false);
    expect(payslipDetailModel(slip({ status: 'paid' })).employer_recorded).toBe(true);
  });

  test('a run gives an employer total only when every payslip carries its shares', () => {
    const runs: PayrollRun[] = [{ id: 'r1', period_month: '2026-10-01', status: 'paid', paid_at: null, paid_by_name: null }];
    const all = payrollModel(runs, [slip(), slip({ id: 'p2', employee_id: 'e2' })]).latest!;
    expect(all.employer_recorded).toBe(true);
    expect(runEmployerLine(all)).toBe('Employer contributions RM 1,495.00 · cost RM 11,495.00');
    const mixed = payrollModel(runs, [slip(), slip({ id: 'p2', employee_id: 'e2', employer_recorded: false })]).latest!;
    expect(mixed.employer_recorded).toBe(false);
    expect(runEmployerLine(mixed)).toBe(RUN_EMPLOYER_NOT_RECORDED);
    // Recorded and genuinely zero still says so, rather than saying nothing.
    const zero = payrollModel(runs, [
      slip({ epf_employer_cents: 0, socso_employer_cents: 0, eis_employer_cents: 0, gross_cents: 0 }),
    ]).latest!;
    expect(runEmployerLine(zero)).toBe('Employer contributions RM 0.00 · cost RM 0.00');
    expect(runEmployerLine(payrollModel(runs, []).latest!)).toBeNull();
  });
});
