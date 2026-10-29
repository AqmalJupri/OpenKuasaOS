// tests/people-payroll-leaver.test.ts
// An employee who leaves before the month ends is paid the days they worked,
// under section 18A(b) of the Employment Act (issue #421). The figures are
// pinned by supabase/tests/people_payroll_check.sql, which runs the functions on
// Postgres; this file checks the shape that keeps them right.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const FILE = '20261128091000_people_payroll_leaver.sql';
const path = join(process.cwd(), 'supabase/migrations', FILE);
/** The migration without its comment lines, so a promise in a comment cannot pass a check. */
const sql = existsSync(path)
  ? readFileSync(path, 'utf8')
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('--'))
      .join('\n')
  : '';

/** One function's header and body, from `create or replace function <name>(` to its `$$;`. */
function fn(qualified: string): string {
  const start = sql.indexOf(`create or replace function ${qualified}(`);
  expect(start, `${qualified} in ${FILE}`).toBeGreaterThan(-1);
  return sql.slice(start, sql.indexOf('$$;', start));
}

const checks = () => readFileSync(join(process.cwd(), 'supabase/tests/people_payroll_check.sql'), 'utf8');
const types = () => readFileSync(join(process.cwd(), 'src/lib/people/types.ts'), 'utf8');

describe('a leaver is paid the days worked', () => {
  test('the record gains a last day, and the line a source of its own', () => {
    expect(sql).toContain('add column if not exists left_date date');
    expect(sql).toContain("check (source in ('hr','overtime','unpaid_leave','joiner','leaver'))");
    expect(sql).toContain("or (source in ('unpaid_leave','joiner','leaver') and kind = 'unpaid')");
    expect(types()).toContain("export type PayslipLineSource = 'hr' | 'overtime' | 'unpaid_leave' | 'joiner' | 'leaver';");
    expect(types()).toContain('left_date: string | null;');
  });

  test('the eligible days stop at the last day, and pay is rounded once as before', () => {
    const build = fn('private.hr_payroll_build_payslip');
    expect(build).toContain('select e.join_date, e.left_date into joined, left_on from public.hr_employees e');
    expect(build).toContain('if left_on is not null and left_on < last_day then last_day := left_on; end if;');
    expect(build).toContain('employed := greatest(last_day - first_day + 1, 0);');
    expect(build).toContain('pay := round(salary::numeric * (employed - days) / days_in_month)::bigint;');
    expect(build).toContain('boundary := salary - round(salary::numeric * employed / days_in_month)::bigint;');
    expect(build).toContain('unpaid := salary - pay - boundary;');
  });

  test('unpaid leave after the last day is not counted', () => {
    const days = fn('private.hr_payroll_unpaid_days');
    expect(days).toContain('least((p_month + interval \'1 month\')::date - 1,');
    expect(days).toContain('coalesce(e.left_date, (p_month + interval \'1 month\')::date - 1)) as last_day');
    expect(days).toContain('generate_series(greatest(r.start_date, b.first_day), least(r.end_date, b.last_day), interval \'1 day\')');
  });

  test('overtime after the last day is not paid', () => {
    const build = fn('private.hr_payroll_build_payslip');
    expect(build).toContain('and r.amount_cents > 0 and r.work_date <= last_day');
    expect(build).not.toContain('and r.amount_cents > 0 and r.work_date <= month_end');
  });

  test('the line names the boundary that left the days unpaid', () => {
    const build = fn('private.hr_payroll_build_payslip');
    expect(build).toContain("'Left ' || to_char(left_on, 'FMDD Mon YYYY') || ' (' || employed || ' of ' || days_in_month || ' days)'");
    expect(build).toContain("'Joined ' || to_char(joined, 'FMDD Mon YYYY') || ', left ' || to_char(left_on, 'FMDD Mon YYYY') ||");
    // The join-only label is unchanged, so no existing payslip moves.
    expect(build).toContain("'Joined ' || to_char(joined, 'FMDD Mon YYYY') || ' (' || employed || ' of ' || days_in_month || ' days)'");
  });

  test('a month entirely after the last day gets no payslip, and status is left alone', () => {
    const fill = fn('private.hr_payroll_fill');
    const skipped = fn('private.hr_payroll_skipped');
    expect(fill).toContain('and (e.left_date is null or e.left_date >= p_run.period_month)');
    expect(skipped).toContain('and (e.left_date is null or e.left_date >= p_run.period_month)');
    // Flipping the status would drop the final month from both the fill and the skipped list.
    expect(sql).not.toContain("set status = 'inactive'");
  });

  test('the workspace check pins a mid-month leaver, a join and leave in one month, unpaid leave and the last day', () => {
    const text = checks();
    expect(text).toContain('Left 20 Mar 2025 (20 of 31 days)');
    expect(text).toContain('Joined 10 Mar 2025, left 20 Mar 2025 (11 of 31 days)');
  });
});
