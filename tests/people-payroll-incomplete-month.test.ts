// tests/people-payroll-incomplete-month.test.ts
// Unpaid leave and a joiner's first month follow section 18A of the Employment
// Act: monthly wages x eligible days / days in the wage period, all in calendar
// days (issue #404). The figures themselves are pinned by
// supabase/tests/people_payroll_check.sql, which runs the functions on Postgres;
// this file checks the shape that keeps them right.
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

const checks = () => readFileSync(join(process.cwd(), 'supabase/tests/people_payroll_check.sql'), 'utf8');

describe('payroll incomplete month follows s.18A', () => {
  test('unpaid days are calendar days from the join date, holidays left out, each day once', () => {
    const days = fn('private.hr_payroll_unpaid_days');
    // Not the workspace's working days: rest days inside the leave are unpaid too.
    expect(days).not.toMatch(/working_day/);
    expect(days).toContain("generate_series(greatest(r.start_date, b.first_day), least(r.end_date, b.last_day), interval '1 day')");
    // Leave before the join date is already left unpaid by the joiner line.
    expect(days).toContain('greatest(p_month, coalesce(e.join_date, p_month)) as first_day');
    // A public holiday inside the leave stays paid.
    expect(days).toContain('from public.hr_public_holidays h where h.org_id = p_org and h.holiday_date = d::date');
    // Two requests over one day count it once.
    expect(days).toContain('group by d::date');
  });

  test('the pay is worked out once, and the two lines add up to what it leaves unpaid', () => {
    const build = fn('private.hr_payroll_build_payslip');
    expect(build).toContain('days_in_month := extract(day from month_end)::int;');
    expect(build).toContain('pay := round(salary::numeric * (employed - days) / days_in_month)::bigint;');
    expect(build).toContain('joiner := salary - round(salary::numeric * employed / days_in_month)::bigint;');
    expect(build).toContain('unpaid := salary - pay - joiner;');
    // The s.60I rate and the working-day pro-rating no longer decide a partial month.
    expect(build).not.toMatch(/working_days|26\.0/);
  });

  test('each line names the days it used, so the figure can be checked against the Act', () => {
    const build = fn('private.hr_payroll_build_payslip');
    expect(build).toContain("'Joined ' || to_char(joined, 'FMDD Mon YYYY') || ' (' || employed || ' of ' || days_in_month || ' days)'");
    expect(build).toContain("'Unpaid leave, ' || trim_scale(days) || ' of ' || days_in_month || ' days'");
  });

  test('the demo reseed pro-rates its joiners the same way, not by working days', () => {
    const reseed = fn('private.reseed_demo_people');
    expect(reseed).not.toContain('hr_payroll_working_days');
    expect(reseed).toContain("' of ' || j.days_in_month || ' days)'");
  });

  test('every draft payslip is built again, and no paid one', () => {
    const tail = sql.slice(sql.lastIndexOf('do $$'));
    expect(tail).toContain("where r.status = 'draft'");
    expect(tail).toContain('perform private.hr_payroll_build_payslip(s);');
    expect(tail).toContain('perform private.hr_payroll_refresh_payslip(s);');
  });

  test('the migration replaces these three functions and nothing else', () => {
    const replaced = [...sql.matchAll(/create or replace function ([a-z_.]+)\(/g)].map((m) => m[1]);
    expect(replaced.sort()).toEqual([
      'private.hr_payroll_build_payslip',
      'private.hr_payroll_unpaid_days',
      'private.reseed_demo_people',
    ]);
    expect(sql).not.toMatch(/(alter table|drop policy|create policy|create table|create index|drop function|grant )\b/);
  });

  test('the workspace check pins the cases the calendar-day rule decides', () => {
    const text = checks();
    expect(text).toContain('Unpaid leave, 4 of 31 days'); // Friday to Monday, the Sunday included
    expect(text).toContain('Unpaid leave, 30 of 31 days'); // a whole month, the holiday paid
    expect(text).toContain('Unpaid leave, 11 of 31 days'); // only the days after joining
    expect(text).toContain('Unpaid leave, 0.5 of 31 days" 4838'); // rounded once with the joiner line
  });
});
