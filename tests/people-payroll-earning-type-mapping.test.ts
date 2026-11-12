// tests/people-payroll-earning-type-mapping.test.ts
// What an earning type counts towards lives in one table, so the five places
// that used to restate it cannot drift when a type like commission is added.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createPeopleTools } from '@/lib/ai/people-tools';
import { EARNING_TYPE_OPTIONS, earningTypeNote, wagesNote } from '@/lib/people/payroll-forms';
import { EARNING_TYPE_WAGES, PAYSLIP_EARNING_TYPES, type PeopleData, type PeopleViewer } from '@/lib/people/types';

const FILE = '20261203090000_people_payroll_earning_type_mapping.sql';

/** The migration without its comment lines, so a promise in a comment cannot satisfy a check. */
const sql = () =>
  readFileSync(join(process.cwd(), 'supabase/migrations', FILE), 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

/** The rows the migration inserts into the mapping table. */
const seeded = () =>
  [...sql().replace(/\s+/g, ' ').matchAll(/\('([a-z_]+)', (true|false), (true|false)\)/g)].map((match) => ({
    earning_type: match[1],
    in_epf: match[2] === 'true',
    in_socso: match[3] === 'true',
  }));

describe('the one mapping the database and the app share', () => {
  test('the table is seeded with exactly the mapping the app carries', () => {
    expect(seeded()).toEqual(
      EARNING_TYPE_WAGES.map((row) => ({ earning_type: row.value, in_epf: row.inEpf, in_socso: row.inSocso })),
    );
  });

  test('the form and the type list hold the same types, each once', () => {
    expect([...EARNING_TYPE_WAGES.map((row) => row.value)].sort()).toEqual([...PAYSLIP_EARNING_TYPES].sort());
    expect(EARNING_TYPE_OPTIONS.map((option) => option.value).sort()).toEqual([...PAYSLIP_EARNING_TYPES].sort());
    // The form puts ordinary pay first; the order of the rest is the form's own choice.
    expect(EARNING_TYPE_OPTIONS[0].value).toBe('ordinary');
    expect(EARNING_TYPE_WAGES[0].value).toBe('ordinary');
  });

  test('the refresh takes each wage base from the table, not from a list of types', () => {
    expect(sql()).toContain('w.in_epf');
    expect(sql()).toContain('w.in_socso');
    expect(sql()).not.toMatch(/earning_type not in \(/);
  });

  test('the save function asks the table whether the type exists', () => {
    expect(sql()).toMatch(/exists \(select 1 from public\.hr_earning_type_wages/);
    expect(sql()).not.toContain("line_type not in ('ordinary'");
  });

  test('a line\'s type points at the table, so a type cannot be stored that the table does not hold', () => {
    expect(sql()).toMatch(
      /add constraint hr_payslip_lines_earning_type_fkey\s+foreign key \(earning_type\) references public\.hr_earning_type_wages/,
    );
  });
});

describe('the sentence built from the flags', () => {
  test('each pair of flags has one sentence, and it is the one the form already showed', () => {
    expect(wagesNote({ inEpf: true, inSocso: true })).toBe('Counts towards EPF, SOCSO and EIS wages.');
    expect(wagesNote({ inEpf: true, inSocso: false })).toBe('Counts towards EPF wages only, not SOCSO or EIS.');
    expect(wagesNote({ inEpf: false, inSocso: true })).toBe('Counts towards SOCSO and EIS wages only, not EPF.');
    expect(wagesNote({ inEpf: false, inSocso: false })).toBe('Not EPF, SOCSO or EIS wages.');
  });

  test('every note the form shows comes from that type\'s own flags', () => {
    for (const row of EARNING_TYPE_WAGES) {
      if (row.value === 'ordinary') {
        expect(earningTypeNote(row.value)).toBeNull();
        continue;
      }
      expect(earningTypeNote(row.value), row.value).toBe(wagesNote({ inEpf: row.inEpf, inSocso: row.inSocso }));
    }
  });
});

describe('the assistant is told the same mapping', () => {
  const hrViewer: PeopleViewer = { employeeId: null, isHr: true, isDemo: false };
  const hrWrite = {
    ctx: { client: {} as never, orgId: 'org-1' },
    tier: 'hr' as const,
    employeeId: null,
    receipt: null,
    userId: 'u1',
  };

  /** What the payroll assistant's `earning_type` description says, on a tool set built from no data. */
  const earningTypeDescription = () => {
    const built = createPeopleTools({} as PeopleData, hrViewer, new Date('2026-10-15T00:00:00Z'), hrWrite);
    return (
      (built.savePayslipLine as unknown as { inputSchema: { shape: { earning_type: { description?: string } } } })
        .inputSchema.shape.earning_type.description ?? ''
    );
  };

  test('every type is described from its own flags, so a type added to the mapping is described too', () => {
    const description = earningTypeDescription();
    for (const row of EARNING_TYPE_WAGES) {
      const phrase = row.inEpf && row.inSocso ? 'all three' : row.inEpf ? 'EPF only' : row.inSocso ? 'SOCSO and EIS only' : 'none';
      expect(description, row.value).toContain(`${row.value} towards ${phrase}`);
    }
  });
});

describe('the mapping is proved on a database too', () => {
  const check = () => readFileSync(join(process.cwd(), 'supabase/tests/people_payroll_earning_type_mapping_check.sql'), 'utf8');

  test('the check file moves one row and reads the payslip again', () => {
    const text = check();
    // The drift guard: one row says a bonus is SOCSO wages, and the next refresh follows it.
    expect(text).toContain("set in_socso = true where earning_type = 'bonus'");
    expect(text).toContain('PASSED');
  });
});
