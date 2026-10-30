-- Lekiu payroll: the employer's EPF, SOCSO and EIS shares are worked out from the
-- same rules table as the employee's, as a rate of wages (issue #403).
--
-- Before this migration the rules table said only what the employee pays, so the
-- employer's share existed nowhere: not on the payslip, not in a run total. The
-- employer had to read the tables and add it up themselves before the KWSP and
-- PERKESO submissions.
--
-- Two things the table could not say:
--   * who pays. One row per scheme and category, read as the employee's share.
--     An employer row without a payer column would have been read as the
--     employee's, and taken off net pay.
--   * which wage band a row covers. Employer EPF is 13% of wages up to RM5,000
--     and 12% above it, so RM5,000.00 is RM650.00 and RM5,000.01 is RM600.00: one
--     sen more wages and the share drops RM50.00. A rate and a maximum cannot
--     step down.
--
-- What the employer pays (KWSP's mandatory contribution page and the Third
-- Schedule from 1 October 2025; PERKESO's Akta 4 and Akta 800 tables):
--   EPF    citizen 13% to RM5,000, 12% above it, both below 60; 4% from 60.
--          permanent resident and non-citizen before 1998: the same, then 6.5%
--          and 6% from 60. Other non-citizens: 2% at any age (Part F). Nothing
--          from 75, KWSP's maximum age.
--   SOCSO  1.75% below 60, and 1.25% from 60 in the second category, which is
--          employer only. A foreign worker is in the Invalidity Scheme too, so
--          every category pays it.
--   EIS    0.2%, citizens and permanent residents aged 18 to 60 only.
--
-- The employer's SOCSO and EIS figures are estimates, worked out as a rate of
-- wages like the employee's. PERKESO does not charge a rate: its table charges a
-- fixed amount for each wage band (more than RM3,100 and up to RM3,200 is RM55.15
-- for the employer, first category), so below the ceiling a figure here can be a
-- few sen off the table's. HR checks it against PERKESO's table; the banded
-- figures, for both shares, are tracked in #423.
--
-- The ceilings are PERKESO's own top band figures rather than a derived rate:
-- 1.75% of the RM5,950 band is 10413 cents, two sen under the table's 10415, and
-- 1.25% of it is 7437.5, under the table's 7440. The employer rows carry
-- round_to_cents = 5: the rate is applied to the wage, rounded to five sen, and
-- then held at the ceiling. That is a rounding, not the table: the figure is sure
-- to agree with PERKESO's only at the top band. The employee rows keep
-- round_to_cents = 1, which is the rounding they had, so not one employee figure
-- moves.
--
-- Where it lands: three columns of their own on hr_payslips, never inside the
-- generated net_cents, because employer money in a deduction would cut what the
-- employee takes home. They are always worked out, never typed over: set_by_hr
-- stays the employee's four figures. Both are read through hr_payslip_json.
--
-- A fourth column, employer_recorded, says whether the three were worked out at
-- all. Zero is a real answer (a month of unpaid leave pays no wages and owes no
-- share), so a zero cannot also mean "from before this migration". The payslip
-- function sets it whenever it works a payslip out.
--
-- A draft on record is worked out again so its payslips carry the figures; a
-- paid payslip is a record of what was paid and does not move, so it keeps
-- employer_recorded false and the app says the shares were not recorded.
--
-- Still open in #423: the banded EPF and PERKESO tables, for the employee's share
-- and the employer's, which this migration's wage band column is ready for.

-- ---- who pays, and which wage band a row covers -----------------------------
-- employee_from_age and employee_until_age are the row's own age band whoever
-- pays; the names stay as they were so nothing that reads them has to change.
alter table public.hr_statutory_rules
  add column payer text not null default 'employee' check (payer in ('employee', 'employer')),
  add column wage_from_cents bigint not null default 0 check (wage_from_cents >= 0),
  add column round_to_cents smallint not null default 1 check (round_to_cents in (1, 5, 10, 100)),
  drop constraint hr_statutory_rules_pkey,
  add primary key (scheme, payer, citizenship, employee_from_age, wage_from_cents);

-- ---- the employer's rows ----------------------------------------------------
insert into public.hr_statutory_rules
  (scheme, payer, citizenship, employee_from_age, employee_until_age, wage_from_cents, rate, max_cents, round_to_cents, note) values
  ('epf', 'employer', 'citizen', 0, 60, 0, 0.13, null, 1,
    'Third Schedule Part A, employer share of wages up to RM 5,000'),
  ('epf', 'employer', 'citizen', 0, 60, 500001, 0.12, null, 1,
    'Third Schedule Part A, employer share of wages above RM 5,000'),
  ('epf', 'employer', 'citizen', 60, 75, 0, 0.04, null, 1,
    'Third Schedule Part E, employer share from 60 to KWSP''s maximum age of 75'),
  ('epf', 'employer', 'permanent_resident', 0, 60, 0, 0.13, null, 1,
    'Third Schedule Part A, employer share of wages up to RM 5,000'),
  ('epf', 'employer', 'permanent_resident', 0, 60, 500001, 0.12, null, 1,
    'Third Schedule Part A, employer share of wages above RM 5,000'),
  ('epf', 'employer', 'permanent_resident', 60, 75, 0, 0.065, null, 1,
    'Third Schedule Part C, employer share from 60, up to RM 5,000'),
  ('epf', 'employer', 'permanent_resident', 60, 75, 500001, 0.06, null, 1,
    'Third Schedule Part C, employer share from 60, above RM 5,000'),
  ('epf', 'employer', 'non_citizen_before_1998', 0, 60, 0, 0.13, null, 1,
    'Third Schedule Part A, employer share of wages up to RM 5,000'),
  ('epf', 'employer', 'non_citizen_before_1998', 0, 60, 500001, 0.12, null, 1,
    'Third Schedule Part A, employer share of wages above RM 5,000'),
  ('epf', 'employer', 'non_citizen_before_1998', 60, 75, 0, 0.065, null, 1,
    'Third Schedule Part C, employer share from 60, up to RM 5,000'),
  ('epf', 'employer', 'non_citizen_before_1998', 60, 75, 500001, 0.06, null, 1,
    'Third Schedule Part C, employer share from 60, above RM 5,000'),
  ('epf', 'employer', 'non_citizen', 0, 75, 0, 0.02, null, 1,
    'Third Schedule Part F, employer share at any age to 75; mandatory from October 2025 wages'),
  ('socso', 'employer', 'citizen', 0, 60, 0, 0.0175, 10415, 5,
    'First category, employer share below 60; top band figure RM 104.15'),
  ('socso', 'employer', 'citizen', 60, null, 0, 0.0125, 7440, 5,
    'Second category from 60, employer only; top band figure RM 74.40'),
  ('socso', 'employer', 'permanent_resident', 0, 60, 0, 0.0175, 10415, 5,
    'First category, employer share below 60; top band figure RM 104.15'),
  ('socso', 'employer', 'permanent_resident', 60, null, 0, 0.0125, 7440, 5,
    'Second category from 60, employer only; top band figure RM 74.40'),
  ('socso', 'employer', 'non_citizen_before_1998', 0, 60, 0, 0.0175, 10415, 5,
    'Invalidity Scheme employer share for foreign workers from 1 July 2024, below 60; top band figure RM 104.15'),
  ('socso', 'employer', 'non_citizen_before_1998', 60, null, 0, 0.0125, 7440, 5,
    'Second category from 60, employer only; top band figure RM 74.40'),
  ('socso', 'employer', 'non_citizen', 0, 60, 0, 0.0175, 10415, 5,
    'Invalidity Scheme employer share for foreign workers from 1 July 2024, below 60; top band figure RM 104.15'),
  ('socso', 'employer', 'non_citizen', 60, null, 0, 0.0125, 7440, 5,
    'Second category from 60, employer only; top band figure RM 74.40'),
  ('eis', 'employer', 'citizen', 18, 60, 0, 0.002, 1190, 5,
    'Employer share, ages 18 to 60; wage ceiling RM 6,000 from 1 October 2024'),
  ('eis', 'employer', 'permanent_resident', 18, 60, 0, 0.002, 1190, 5,
    'Employer share, ages 18 to 60; wage ceiling RM 6,000 from 1 October 2024');

-- ---- a proposed statutory figure ------------------------------------------
-- The rate of the one rule for the scheme, who pays it, the category (empty is a
-- citizen), the age and the wage: of the rows whose age band holds the age and
-- whose wage band the wage reaches, the one that starts highest. Rounded to the
-- sen, or to the row's own five sen, and held at the row's maximum. Zero when no
-- rule matches.
--
-- The payer argument is last and defaults to the employee, so every four argument
-- call written before this migration keeps working and reads the same row.
create or replace function private.hr_payroll_proposal(
  p_scheme text, p_wage_cents bigint, p_age int, p_citizenship text, p_payer text default 'employee')
returns bigint language sql stable set search_path = public as $$
  select coalesce((
    select least(
             round(p_wage_cents * s.rate / s.round_to_cents) * s.round_to_cents,
             s.max_cents)::bigint
    from public.hr_statutory_rules s
    where s.scheme = p_scheme
      and s.payer = coalesce(p_payer, 'employee')
      and s.citizenship = coalesce(p_citizenship, 'citizen')
      and s.wage_from_cents <= coalesce(p_wage_cents, 0)
      and case
        when p_age is null then s.employee_from_age <= 18 and coalesce(s.employee_until_age, 1000) >= 60
        else p_age >= s.employee_from_age and p_age < coalesce(s.employee_until_age, 1000)
      end
    order by s.wage_from_cents desc
    limit 1
  ), 0);
$$;
revoke all on function private.hr_payroll_proposal(text, bigint, int, text, text) from public, anon, authenticated;

-- The four argument version this replaces, called from the check file and from
-- nowhere else; the default above answers those calls.
drop function if exists private.hr_payroll_proposal(text, bigint, int, text);

-- ---- the employer's share, on the payslip ----------------------------------
-- Not in net_cents: that generated column is gross less the employee's five
-- deductions, and an employer figure in it would cut take home pay.
alter table public.hr_payslips
  add column epf_employer_cents bigint not null default 0 check (epf_employer_cents >= 0),
  add column socso_employer_cents bigint not null default 0 check (socso_employer_cents >= 0),
  add column eis_employer_cents bigint not null default 0 check (eis_employer_cents >= 0),
  -- Whether the three above were worked out. False on every row already here; the
  -- payslip function sets it, so a paid payslip from before this migration stays false.
  add column employer_recorded boolean not null default false;

-- ---- what follows from a payslip's basic pay and its lines ----------------
-- As in 20261127091000, with the employer's three shares worked out beside the
-- employee's, on the same wage base each scheme counts and the same age.
create or replace function private.hr_payroll_refresh_payslip(p_payslip uuid)
returns public.hr_payslips language plpgsql set search_path = public as $$
declare
  slip public.hr_payslips;
  earnings bigint;
  earnings_epf bigint;
  earnings_socso bigint;
  unpaid bigint;
  deductions bigint;
  gross bigint;
  epf_wages bigint;
  socso_wages bigint;
  age_years int;
  category text;
  last_pcb bigint;
begin
  select p.* into slip from public.hr_payslips p where p.id = p_payslip;
  select coalesce(sum(l.amount_cents) filter (where l.kind = 'earning'), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'earning' and l.source <> 'overtime'
           and l.earning_type not in ('service_charge','gratuity','travel_allowance')), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'earning'
           and l.earning_type not in ('bonus','gratuity','travel_allowance')), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'unpaid'), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'deduction'), 0)
  into earnings, earnings_epf, earnings_socso, unpaid, deductions
  from public.hr_payslip_lines l where l.payslip_id = slip.id;
  gross := greatest(slip.basic_cents + earnings - unpaid, 0);
  -- EPF wages: no overtime, no service charge, no gratuity, no travel allowance.
  epf_wages := greatest(slip.basic_cents + earnings_epf - unpaid, 0);
  -- SOCSO and EIS wages: overtime and a service charge in, an annual bonus, a gratuity and a travel allowance out.
  socso_wages := greatest(slip.basic_cents + earnings_socso - unpaid, 0);
  -- The age already reached before the month began: a birthday inside the month
  -- changes the shares from the next month.
  age_years := private.hr_payroll_age_on(slip.employee_id, slip.period_month - 1);
  select x.citizenship into category from public.hr_employee_private x where x.employee_id = slip.employee_id;

  select q.pcb_cents into last_pcb from public.hr_payslips q
  where q.employee_id = slip.employee_id and q.status = 'paid'
  order by q.period_month desc limit 1;

  update public.hr_payslips p
  set gross_cents = gross,
      epf_cents = case when 'epf' = any(p.set_by_hr) then p.epf_cents else private.hr_payroll_proposal('epf', epf_wages, age_years, category) end,
      socso_cents = case when 'socso' = any(p.set_by_hr) then p.socso_cents else private.hr_payroll_proposal('socso', socso_wages, age_years, category) end,
      eis_cents = case when 'eis' = any(p.set_by_hr) then p.eis_cents else private.hr_payroll_proposal('eis', socso_wages, age_years, category) end,
      epf_employer_cents = private.hr_payroll_proposal('epf', epf_wages, age_years, category, 'employer'),
      socso_employer_cents = private.hr_payroll_proposal('socso', socso_wages, age_years, category, 'employer'),
      eis_employer_cents = private.hr_payroll_proposal('eis', socso_wages, age_years, category, 'employer'),
      employer_recorded = true,
      pcb_cents = case when 'pcb' = any(p.set_by_hr) then p.pcb_cents else coalesce(last_pcb, 0) end,
      other_deductions_cents = deductions
  where p.id = slip.id
  returning p.* into slip;
  return slip;
end; $$;
revoke all on function private.hr_payroll_refresh_payslip(uuid) from public, anon, authenticated;

-- ---- a payslip, as the functions hand it back -----------------------------
-- The three employer figures, and whether they were worked out, join the JSON the
-- payroll functions hand back: the change tools read them from here.
create or replace function private.hr_payslip_json(p_slip public.hr_payslips)
returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object(
    'id', p_slip.id, 'employee_id', p_slip.employee_id, 'period_month', p_slip.period_month,
    'basic_cents', p_slip.basic_cents, 'gross_cents', p_slip.gross_cents,
    'epf_cents', p_slip.epf_cents, 'socso_cents', p_slip.socso_cents, 'eis_cents', p_slip.eis_cents,
    'epf_employer_cents', p_slip.epf_employer_cents,
    'socso_employer_cents', p_slip.socso_employer_cents,
    'eis_employer_cents', p_slip.eis_employer_cents,
    'employer_recorded', p_slip.employer_recorded,
    'pcb_cents', p_slip.pcb_cents, 'other_deductions_cents', p_slip.other_deductions_cents,
    'net_cents', p_slip.net_cents, 'set_by_hr', to_jsonb(p_slip.set_by_hr), 'status', p_slip.status);
$$;
revoke all on function private.hr_payslip_json(public.hr_payslips) from public, anon, authenticated;

-- ---- drafts already worked out ----------------------------------------------
-- Nothing moves for the employee: their figures are the same rows they were. The
-- employer columns of a draft would otherwise read zero, and not recorded, until
-- something changed the payslip; worked out here, each draft is marked recorded.
-- Paid payslips are a record of what was paid and are left alone, still false.
do $$
begin
  perform private.hr_payroll_refresh_payslip(p.id)
  from public.hr_payslips p
  join public.hr_payroll_runs r on r.id = p.payroll_run_id
  where r.status = 'draft';
end $$;
