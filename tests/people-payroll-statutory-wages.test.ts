// tests/people-payroll-statutory-wages.test.ts
// The payroll proposals follow the age and overtime rules of the KWSP Third
// Schedule and PERKESO's tables, as far as the record already says enough to
// apply them (issue #402).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const FILE = '20261126090000_people_payroll_statutory_age_wages.sql';

/** The workspace's own arithmetic check, which calls the private functions the migration replaces. */
const checks = () => readFileSync(join(process.cwd(), 'supabase/tests/people_payroll_check.sql'), 'utf8');

/** The top-level arguments of each call of a function, ignoring commas inside a nested call or a string. */
function callArguments(text: string, called: string): string[][] {
  const found: string[][] = [];
  for (let at = text.indexOf(called); at > -1; at = text.indexOf(called, at + 1)) {
    let depth = 0;
    let quoted = false;
    const args: string[] = [];
    let from = at + called.length + 1;
    for (let i = from; i < text.length; i++) {
      const c = text[i];
      if (c === "'") quoted = !quoted;
      if (quoted) continue;
      if (c === '(') depth++;
      if (c === ')') {
        if (depth === 0) {
          args.push(text.slice(from, i));
          found.push(args);
          break;
        }
        depth--;
      }
      if (c === ',' && depth === 0) {
        args.push(text.slice(from, i));
        from = i + 1;
      }
    }
  }
  return found;
}


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

describe('payroll statutory wages and age', () => {
  test('age is read from the date of birth on file, on the last day of the wage month', () => {
    const age = fn('private.hr_payroll_age_on');
    expect(age).toContain('p_employee uuid, p_on date');
    expect(age).toContain('extract(year from age(p_on, x.date_of_birth))::int');
    // Nothing at all when there is no date of birth: the caller reads an empty answer as under 60.
    expect(age).toContain('x.date_of_birth is not null');
    expect(sql).toContain('revoke all on function private.hr_payroll_age_on(uuid, date) from public, anon, authenticated;');
    // The month's contribution is paid after the month, so the last day of it decides the age.
    expect(fn('private.hr_payroll_refresh_payslip')).toContain(
      'private.hr_payroll_age_on(slip.employee_id, (slip.period_month + interval \'1 month\')::date - 1)',
    );
  });

  test('no employee EPF, SOCSO or EIS from the age of 60, and no contribution dropped on a guess', () => {
    const proposal = fn('private.hr_payroll_proposal');
    expect(proposal).toContain('p_scheme text, p_wage_cents bigint, p_age int');
    expect(proposal).toContain("coalesce(p_age, 0) >= 60 and p_scheme in ('epf', 'socso', 'eis')");
    // The rate on the base it is handed, still capped, still in one place.
    expect(proposal).toContain('least(round(p_wage_cents * s.rate), s.max_cents)::bigint');
    expect(sql).toContain('drop function if exists private.hr_payroll_proposal(text, bigint);');
  });

  test('EPF is worked out without the overtime lines, SOCSO and EIS on gross', () => {
    const refresh = fn('private.hr_payroll_refresh_payslip');
    expect(refresh).toContain("l.kind = 'earning' and l.source <> 'overtime'");
    expect(refresh).toContain('epf_wages := greatest(slip.basic_cents + earnings_epf - unpaid, 0);');
    expect(refresh).toContain('gross := greatest(slip.basic_cents + earnings - unpaid, 0);');
    expect(refresh).toContain(
      "private.hr_payroll_proposal('epf', epf_wages, age_years)",
    );
    expect(refresh).toContain("private.hr_payroll_proposal('socso', gross, age_years)");
    expect(refresh).toContain("private.hr_payroll_proposal('eis', gross, age_years)");
  });

  test('a figure an owner or admin typed over still wins, and PCB is left as it was', () => {
    const refresh = fn('private.hr_payroll_refresh_payslip');
    for (const field of ['epf', 'socso', 'eis']) {
      expect(refresh).toContain(`'${field}' = any(p.set_by_hr) then p.${field}_cents`);
    }
    expect(refresh).toContain(
      "pcb_cents = case when 'pcb' = any(p.set_by_hr) then p.pcb_cents else coalesce(last_pcb, 0) end,",
    );
  });

  test('the migration changes these three functions and nothing else', () => {
    const replaced = [...sql.matchAll(/create or replace function ([a-z_.]+)\(/g)].map((m) => m[1]);
    expect(replaced.sort()).toEqual([
      'private.hr_payroll_age_on',
      'private.hr_payroll_proposal',
      'private.hr_payroll_refresh_payslip',
    ]);
    expect(sql).not.toMatch(/(alter table|drop policy|create policy|create table|create index)\b/);
  });

  test('the workspace check calls the proposal with the age, and no figure is left on the old signature', () => {
    const text = checks();
    const calls = callArguments(text, 'private.hr_payroll_proposal');
    expect(calls.length).toBeGreaterThan(0);
    for (const args of calls) {
      // Three arguments: the scheme, the wages and the age. A two-argument call names the signature this migration drops.
      expect(args.length, args.join(' | ')).toBe(3);
    }
    // EPF is compared against its own wages there, not against gross: the overtime lines are not EPF wages.
    expect(text).toContain("l.kind = 'earning' and l.source <> 'overtime'");
    expect(text).toContain('private.hr_payroll_age_on(p.employee_id, (p.period_month + interval \'1 month\')::date - 1)');
  });
});
