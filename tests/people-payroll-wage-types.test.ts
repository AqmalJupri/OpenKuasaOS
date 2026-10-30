// tests/people-payroll-wage-types.test.ts
// An earning line says what kind of earning it is, so EPF wages and SOCSO and
// EIS wages can be built from it (issue #402).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { EARNING_TYPE_OPTIONS, earningTypeNote, toLineInput } from '@/lib/people/payroll-forms';
import { savePayslipLine } from '@/lib/people/payroll-writes';
import type { PayslipEarningType } from '@/lib/people/types';
import { fakeSupabase } from './setup/fake-supabase';

const FILE = '20261127091000_people_payroll_earning_wage_types.sql';

/** A migration without its comment lines, so a promise in a comment cannot satisfy a check. */
const sql = () =>
  readFileSync(join(process.cwd(), 'supabase/migrations', FILE), 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

describe('the earning type a line carries', () => {
  test('an ordinary earning needs no type: it keeps the figure it moved before', () => {
    const converted = toLineInput({ kind: 'earning', label: 'Commission', amount: '500' });
    expect(converted).toEqual({ ok: true, input: { kind: 'earning', earning_type: 'ordinary', label: 'Commission', amount_cents: 50_000 } });
  });

  test('a bonus, a travel allowance, a service charge and a gratuity are kept as what they are', () => {
    for (const type of ['bonus', 'travel_allowance', 'service_charge', 'gratuity']) {
      const converted = toLineInput({ kind: 'earning', earning_type: type, label: 'Raya', amount: '2,000' });
      expect(converted.ok, type).toBe(true);
      expect(converted.ok && converted.input.earning_type, type).toBe(type);
    }
  });

  test('a type that is not on the list is refused, not read as ordinary pay', () => {
    expect(toLineInput({ kind: 'earning', earning_type: 'commission', label: 'Sales', amount: '1' }).ok).toBe(false);
    expect(toLineInput({ kind: 'earning', earning_type: '', label: 'Sales', amount: '1' }).ok).toBe(false);
  });

  test('overtime is the system\'s own type: HR cannot type it on a line', () => {
    expect(toLineInput({ kind: 'earning', earning_type: 'overtime', label: 'Overtime', amount: '1' }).ok).toBe(false);
  });

  test('a deduction carries no earning type', () => {
    const converted = toLineInput({ kind: 'deduction', earning_type: 'bonus', label: 'Advance', amount: '200' });
    expect(converted).toEqual({ ok: true, input: { kind: 'deduction', earning_type: 'ordinary', label: 'Advance', amount_cents: 20_000 } });
  });

  test('every option the form offers is a type the parser accepts', () => {
    for (const option of EARNING_TYPE_OPTIONS) {
      const converted = toLineInput({ kind: 'earning', earning_type: option.value, label: 'Line', amount: '10' });
      expect(converted.ok, option.value).toBe(true);
    }
  });
});

describe('the wage bases the migration builds', () => {
  /** The type lists the refresh reads, in the order the select writes them: EPF wages, then SOCSO and EIS wages. */
  const wageFilters = () =>
    [
      ...sql()
        .replace(/\s+/g, ' ')
        .matchAll(/sum\(l\.amount_cents\) filter \(where l\.kind = 'earning'([^()]*)not in \(([^)]*)\)/g),
    ].map((match) => ({ extra: match[1], types: match[2] }));

  test('the line carries one type, with the list the statutes name', () => {
    expect(sql()).toMatch(/alter table public\.hr_payslip_lines\s+add column earning_type text not null default 'ordinary'/);
    for (const type of ['ordinary', 'bonus', 'gratuity', 'travel_allowance', 'service_charge']) {
      expect(sql()).toContain(`'${type}'`);
    }
  });

  test('the save function keeps a changed line\'s type when none is sent, and its local is not named like the column', () => {
    const save = sql().slice(sql().indexOf('create function public.hr_save_payslip_line'));
    expect(save).toContain('p_earning_type text default null');
    expect(save).toContain("line_type := coalesce(p_earning_type, line.earning_type, 'ordinary');");
    // `earning_type = earning_type` with a variable of that name is ambiguous, and plpgsql refuses the update.
    expect(save).not.toMatch(/^\s*earning_type\s+text/m);
    expect(save).toContain('earning_type = line_type');
  });

  test('a non-earning line carries no type of its own', () => {
    expect(sql()).toMatch(/kind = 'earning' or earning_type = 'ordinary'/);
  });

  test('EPF wages leave overtime, service charge, gratuity and travel allowance out', () => {
    const [epf, socso] = wageFilters();
    expect(epf, 'the EPF wage filter').toBeTruthy();
    for (const type of ['service_charge', 'gratuity', 'travel_allowance']) {
      expect(epf.types, type).toContain(`'${type}'`);
    }
    expect(epf.types).not.toContain("'bonus'");
    expect(epf.extra, 'overtime out of EPF wages').toContain("l.source <> 'overtime'");
    expect(socso).toBeTruthy();
  });

  test('SOCSO and EIS wages leave an annual bonus, gratuity and travel allowance out', () => {
    const [, socso] = wageFilters();
    expect(socso, 'the SOCSO wage filter').toBeTruthy();
    for (const type of ['bonus', 'gratuity', 'travel_allowance']) {
      expect(socso.types, type).toContain(`'${type}'`);
    }
    expect(socso.types).not.toContain("'service_charge'");
    expect(socso.extra, 'overtime stays in SOCSO and EIS wages').not.toContain("l.source <> 'overtime'");
  });

  test('the proposal takes the SOCSO and EIS figures from the wages those schemes count', () => {
    expect(sql()).toMatch(/socso_cents = case when 'socso' = any\(p\.set_by_hr\) then p\.socso_cents else private\.hr_payroll_proposal\('socso', socso_wages/);
    expect(sql()).toMatch(/eis_cents = case when 'eis' = any\(p\.set_by_hr\) then p\.eis_cents else private\.hr_payroll_proposal\('eis', socso_wages/);
  });
});

describe('what the form says each type counts towards', () => {
  const noteOf = (value: PayslipEarningType) => earningTypeNote(value);

  test('each type says which schemes take its amount, and ordinary pay needs no note', () => {
    expect(noteOf('ordinary')).toBeNull();
    expect(noteOf('bonus')).toBe('Counts towards EPF wages only, not SOCSO or EIS.');
    expect(noteOf('service_charge')).toBe('Counts towards SOCSO and EIS wages only, not EPF.');
    expect(noteOf('gratuity')).toBe('Not EPF, SOCSO or EIS wages.');
    expect(noteOf('travel_allowance')).toBe('Not EPF, SOCSO or EIS wages.');
  });
});

describe('the call that saves a typed line', () => {
  afterEach(() => vi.restoreAllMocks());

  const SLIP = '22222222-2222-4222-8222-222222222222';
  const reply = (earning_type: string) => ({
    payslip: {
      id: SLIP, employee_id: 'e1', period_month: '2026-10-01', basic_cents: 300_000, gross_cents: 500_000,
      epf_cents: 55_000, socso_cents: 1_500, eis_cents: 600, pcb_cents: 0, other_deductions_cents: 0,
      epf_employer_cents: 65_000, socso_employer_cents: 8_750, eis_employer_cents: 1_000, employer_recorded: true,
      net_cents: 442_900, set_by_hr: [], status: 'pending',
    },
    line: { id: 'l1', kind: 'earning', source: 'hr', earning_type, label: 'Raya', amount_cents: 200_000 },
  });

  test('sends the type it was given and hands back the type the line holds', async () => {
    const { client, calls } = fakeSupabase({ 'rpc.hr_save_payslip_line': { data: reply('bonus') } });
    const saved = await savePayslipLine({ client, orgId: 'o1' } as never, {
      payslip_id: SLIP, kind: 'earning', earning_type: 'bonus', label: 'Raya', amount_cents: 200_000,
    });
    const args = calls.find((c) => c.fn === 'hr_save_payslip_line')!.args!;
    expect(args.p_earning_type).toBe('bonus');
    expect(saved.ok && saved.data.line.earning_type).toBe('bonus');
  });

  test('a line that names no type sends none, so the database decides: ordinary when new, its own when changed', async () => {
    const { client, calls } = fakeSupabase({ 'rpc.hr_save_payslip_line': { data: reply('ordinary') } });
    await savePayslipLine({ client, orgId: 'o1' } as never, {
      payslip_id: SLIP, kind: 'earning', label: 'Commission', amount_cents: 1_000,
    });
    expect(calls.find((c) => c.fn === 'hr_save_payslip_line')!.args!.p_earning_type).toBeNull();
  });

  test('a type that is not on the list never reaches the database', async () => {
    const { client, calls } = fakeSupabase({ 'rpc.hr_save_payslip_line': { data: reply('bonus') } });
    const saved = await savePayslipLine({ client, orgId: 'o1' } as never, {
      // `overtime` is the system's own type: no caller can put it on a line of its own.
      payslip_id: SLIP, kind: 'earning', earning_type: 'overtime' as never, label: 'Overtime', amount_cents: 1_000,
    });
    expect(saved.ok).toBe(false);
    expect(calls.some((c) => c.fn === 'hr_save_payslip_line')).toBe(false);
  });
});

describe('the migration is proved on a database too', () => {
  const check = () => readFileSync(join(process.cwd(), 'supabase/tests/people_payroll_wage_types_check.sql'), 'utf8');

  test('the check file walks every type through a real payslip', () => {
    const text = check();
    for (const type of ['bonus', 'travel_allowance', 'service_charge', 'gratuity']) {
      expect(text, type).toContain(type);
    }
    expect(text).toContain('PASSED');
  });
});
