// tests/people-payroll-incomplete-month.test.ts
// Unpaid leave and a joiner's first month follow section 18A of the Employment
// Act: monthly wages x eligible days / days in the wage period (issue #404).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const FILE = '20261127090000_people_payroll_s18a_incomplete_month.sql';

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

describe('payroll incomplete month follows s.18A', () => {
  test('the overtime the wage period holds is the calendar month, not the working days', () => {
    const build = fn('private.hr_payroll_build_payslip');
    // The denominator is the days in the wage period: a 31 day month divides by 31.
    expect(build).toContain('extract(day from month_end)');
    // The working-day rule is the s.60I rate and no longer decides a partial month.
    expect(build).not.toContain('hr_payroll_working_days');
    expect(build).not.toContain('26.0');
  });

  test('unpaid leave comes off at basic x days / days in the month, rounded once, still capped', () => {
    const build = fn('private.hr_payroll_build_payslip');
    expect(build).toContain('round(salary::numeric * days / days_in_month)');
    // A half day is 0.5 in the same expression: hr_payroll_unpaid_days already returns it.
    expect(build).toContain('least(round(salary::numeric * days / days_in_month)::bigint, salary - joiner)');
  });

  test('a joiner is paid for the calendar days from the join date to the month end', () => {
    const build = fn('private.hr_payroll_build_payslip');
    expect(build).toContain('round(salary::numeric * (month_end - joined + 1) / days_in_month)');
    expect(build).toContain('joiner := salary - round(salary::numeric * (month_end - joined + 1) / days_in_month)::bigint;');
  });

  test('the line says which days it used, so the figure can be checked against the Act', () => {
    const build = fn('private.hr_payroll_build_payslip');
    // "Joined 16 Mar 2026 (16 of 31 days)" and "Unpaid leave, 2 of 31 days".
    expect(build).toContain('(month_end - joined + 1)');
    expect(build).toContain(`' of ' || days_in_month || ' days'`);
  });

  test('the migration replaces the one function and nothing else', () => {
    const replaced = [...sql.matchAll(/create or replace function ([a-z_.]+)\(/g)].map((m) => m[1]);
    expect(replaced).toEqual(['private.hr_payroll_build_payslip']);
    expect(sql).not.toMatch(/(alter table|drop policy|create policy|create table|create index|drop function)\b/);
  });

  test('the workspace check pins the new labels and the denominator', () => {
    const checks = readFileSync(join(process.cwd(), 'supabase/tests/people_payroll_check.sql'), 'utf8');
    expect(checks).toContain('Joined 21 Mar 2025 (11 of 31 days)');
    expect(checks).toContain('Unpaid leave, 3 of 31 days');
    expect(checks).not.toContain('Unpaid leave, 3 days');
  });
});
