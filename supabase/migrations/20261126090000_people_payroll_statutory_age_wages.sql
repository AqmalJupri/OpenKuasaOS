-- Lekiu payroll: the statutory proposals follow the age and overtime rules the
-- official tables set, where the record already says enough to apply them.
--
-- Two proposals were too high (issue #402):
--   * overtime is not EPF wages (EPF Act 1991, Third Schedule), so it no longer
--     raises the EPF base. It still counts for SOCSO and EIS, whose tables
--     include it;
--   * from the age of 60 there is no employee EPF (the employer still pays 4%),
--     no employee SOCSO (the second category is employer only, 1.25%) and no
--     employee EIS: PERKESO requires contributions from employees aged 18 to 60.
--
-- Age comes from hr_employee_private.date_of_birth and is taken on the last day
-- of the wage month: someone who turned 60 inside the month is 60 for that
-- month's contribution, which is paid after the month ends. No date of birth on
-- file reads as under 60, which keeps the figure this app proposed before and
-- never drops a contribution on a guess.
--
-- Sources: the KWSP Third Schedule (from 1 October 2025) and PERKESO's
-- contribution tables, both linked on #402.
--
-- Still open in #402, and not attempted here: the banded tables themselves (a
-- rate and a cap is still what the money is worked out from), non-citizen EPF
-- rates, and telling an annual bonus apart from the other earning lines. One EIS
-- case the record cannot answer is left alone too: an employee aged 57 and over
-- with no contributions before 57 is exempt, and no contribution history is kept
-- here. PERKESO's "18 to 60" is read as ending when the employee reaches 60, the
-- same day SOCSO's first category ends, so EIS stops on the same boundary.
--
-- A figure an owner or admin typed over still wins, and set_by_hr is untouched.
-- A draft worked out before this migration keeps its figures until it is
-- recalculated: a paid payslip is a record of what was paid and never moves.

-- ---- age ------------------------------------------------------------------
-- Whole years on a day; no row when there is no date of birth on file (the
-- caller reads that as under 60) or the employee is not in the workspace.
create or replace function private.hr_payroll_age_on(p_employee uuid, p_on date)
returns int language sql stable set search_path = public as $$
  select extract(year from age(p_on, x.date_of_birth))::int
  from public.hr_employee_private x
  where x.employee_id = p_employee and x.date_of_birth is not null;
$$;
revoke all on function private.hr_payroll_age_on(uuid, date) from public, anon, authenticated;

-- ---- a proposed statutory figure ------------------------------------------
-- The scheme's rate on the wage base it is given, rounded to the sen, and no
-- more than the scheme's maximum when it has one (`least` passes over an empty
-- maximum). Zero for a scheme with no rule, and zero for the employee's share of
-- EPF, SOCSO and EIS from the age of 60.
create or replace function private.hr_payroll_proposal(p_scheme text, p_wage_cents bigint, p_age int)
returns bigint language sql stable set search_path = public as $$
  select case
    when coalesce(p_age, 0) >= 60 and p_scheme in ('epf', 'socso', 'eis') then 0
    else coalesce((
      select least(round(p_wage_cents * s.rate), s.max_cents)::bigint
      from public.hr_statutory_rules s where s.scheme = p_scheme
    ), 0)
  end;
$$;
revoke all on function private.hr_payroll_proposal(text, bigint, int) from public, anon, authenticated;

-- The two-argument version this replaces, called from nowhere else.
drop function if exists private.hr_payroll_proposal(text, bigint);

-- ---- what follows from a payslip's basic pay and its lines ----------------
-- Works out what follows from a payslip's basic pay and its lines, in this one
-- place, and hands the payslip back:
--   gross       basic + earning lines - unpaid lines, never below zero;
--   EPF wages   the same, less the overtime lines;
--   EPF, SOCSO, EIS   the proposal on those wages at the employee's age in the
--               month, unless HR set the figure;
--   PCB         the PCB of the employee's most recent paid payslip, else zero,
--               unless HR set the figure;
--   other deductions  the sum of the deduction lines.
-- Net pay is the table's own generated column.
create or replace function private.hr_payroll_refresh_payslip(p_payslip uuid)
returns public.hr_payslips language plpgsql set search_path = public as $$
declare
  slip public.hr_payslips;
  earnings bigint;
  earnings_epf bigint;
  unpaid bigint;
  deductions bigint;
  gross bigint;
  epf_wages bigint;
  age_years int;
  last_pcb bigint;
begin
  select p.* into slip from public.hr_payslips p where p.id = p_payslip;
  select coalesce(sum(l.amount_cents) filter (where l.kind = 'earning'), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'earning' and l.source <> 'overtime'), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'unpaid'), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'deduction'), 0)
  into earnings, earnings_epf, unpaid, deductions
  from public.hr_payslip_lines l where l.payslip_id = slip.id;
  gross := greatest(slip.basic_cents + earnings - unpaid, 0);
  -- EPF wages leave overtime out; SOCSO and EIS wages include it.
  epf_wages := greatest(slip.basic_cents + earnings_epf - unpaid, 0);
  -- Age on the last day of the wage month: a person who turned 60 inside it is 60 for it.
  age_years := private.hr_payroll_age_on(slip.employee_id, (slip.period_month + interval '1 month')::date - 1);

  select q.pcb_cents into last_pcb from public.hr_payslips q
  where q.employee_id = slip.employee_id and q.status = 'paid'
  order by q.period_month desc limit 1;

  update public.hr_payslips p
  set gross_cents = gross,
      epf_cents = case when 'epf' = any(p.set_by_hr) then p.epf_cents else private.hr_payroll_proposal('epf', epf_wages, age_years) end,
      socso_cents = case when 'socso' = any(p.set_by_hr) then p.socso_cents else private.hr_payroll_proposal('socso', gross, age_years) end,
      eis_cents = case when 'eis' = any(p.set_by_hr) then p.eis_cents else private.hr_payroll_proposal('eis', gross, age_years) end,
      pcb_cents = case when 'pcb' = any(p.set_by_hr) then p.pcb_cents else coalesce(last_pcb, 0) end,
      other_deductions_cents = deductions
  where p.id = slip.id
  returning p.* into slip;
  return slip;
end; $$;
revoke all on function private.hr_payroll_refresh_payslip(uuid) from public, anon, authenticated;
