-- Lekiu payroll: the statutory proposals follow the age and overtime rules the
-- official tables set, where the record already says enough to apply them.
--
-- Two proposals were too high (issue #402):
--   * overtime is not EPF wages (EPF Act 1991, Third Schedule), so it no longer
--     raises the EPF base. It still counts for SOCSO and EIS, whose tables
--     include it;
--   * from the age of 60 there is no employee EPF for a Malaysian citizen (Third
--     Schedule Part E: the employer pays 4%), no employee SOCSO (the second
--     category is employer only, 1.25%) and no employee EIS: PERKESO requires
--     EIS contributions from employees aged 18 to 60, so there is none below 18
--     either.
--
-- The ages each scheme's employee share covers are data, on hr_statutory_rules
-- next to the rate and the maximum: employee_from_age (the share starts at this
-- age) and employee_until_age (it stops at this age). Empty means no bound.
--
-- Which month an age counts from. The share changes from the month after the
-- month the employee reaches the age: someone who turns 60 on 15 March still
-- pays in March and stops in April, and someone who turns 60 on 1 April still
-- pays in April. So the age that counts is the age on the last day before the
-- wage month began. The Third Schedule itself says only "who have attained the
-- age of sixty years"; the month after is how KWSP's change is applied in
-- payroll practice, and of the two readings it is the one that never stops a
-- contribution early. EIS starting after 18 is read the same way.
--
-- Age comes from hr_employee_private.date_of_birth. With no date of birth on
-- file it is read from a Malaysian identity card number, whose first six digits
-- are the date of birth (YYMMDD): twelve digits once dashes and spaces are taken
-- out, and a real date, or nothing. The century is the one that makes the
-- employee at least 14 (EPF's youngest member) on the day. No age at all keeps
-- every share, the figure this app proposed before: nothing is dropped on a
-- guess.
--
-- Not the citizen's rule for everyone: a permanent resident, or a non-citizen
-- who joined EPF before 1 August 1998, still pays 5.5% from 60 (Part C), and a
-- non-citizen who joined from 1 August 1998 pays 2% at any age (Part F). The
-- record does not say who is a citizen, so the zero from 60 is for everyone and
-- the docs tell HR to type the figure in for those staff.
--
-- Sources: the KWSP Third Schedule (from 1 October 2025), KWSP's employer page
-- on mandatory contribution, and PERKESO's contribution tables, linked on #402.
--
-- Still open in #402, and not attempted here: the banded tables themselves (a
-- rate and a cap is still what the money is worked out from), non-citizen EPF
-- rates, and telling an annual bonus apart from the other earning lines. One EIS
-- case the record cannot answer is left alone too: an employee aged 57 and over
-- with no contributions before 57 is exempt, and no contribution history is kept
-- here.
--
-- A figure an owner or admin typed over still wins, and set_by_hr is untouched.
-- Every payslip of a draft run is worked out again at the end, so no draft keeps
-- the old figures; a paid payslip is a record of what was paid and never moves.

-- ---- the ages each employee share covers ----------------------------------
alter table public.hr_statutory_rules
  add column employee_from_age int check (employee_from_age is null or employee_from_age >= 0),
  add column employee_until_age int check (employee_until_age is null or employee_until_age > 0);

update public.hr_statutory_rules set employee_until_age = 60,
  note = 'EPF Act 1991, Third Schedule Part A, employee share below age 60; none from 60 for a Malaysian citizen (Part E)'
where scheme = 'epf';
update public.hr_statutory_rules set employee_until_age = 60,
  note = 'Employee share, first category, below age 60; wage ceiling RM 6,000 from 1 October 2024'
where scheme = 'socso';
update public.hr_statutory_rules set employee_from_age = 18, employee_until_age = 60,
  note = 'Employee share, ages 18 to 60; wage ceiling RM 6,000 from 1 October 2024'
where scheme = 'eis';

-- ---- age ------------------------------------------------------------------
-- Whole years on a day, from the date of birth on file, else from a Malaysian
-- identity card number. Nothing when neither gives a date, when the date is
-- after the day, or when the employee has no private record.
create or replace function private.hr_payroll_age_on(p_employee uuid, p_on date)
returns int language plpgsql stable set search_path = public as $$
declare
  born date;
  card text;
  yy int;
begin
  select x.date_of_birth, regexp_replace(coalesce(x.nric, ''), '[\s-]', '', 'g')
  into born, card
  from public.hr_employee_private x where x.employee_id = p_employee;
  if born is null and card ~ '^[0-9]{12}$' then
    yy := substr(card, 1, 2)::int;
    begin
      born := make_date(
        case when 2000 + yy <= extract(year from p_on)::int - 14 then 2000 + yy else 1900 + yy end,
        substr(card, 3, 2)::int, substr(card, 5, 2)::int);
    exception when datetime_field_overflow or invalid_datetime_format then
      born := null;
    end;
  end if;
  if born is null or born > p_on then
    return null;
  end if;
  return extract(year from age(p_on, born))::int;
end; $$;
revoke all on function private.hr_payroll_age_on(uuid, date) from public, anon, authenticated;

-- ---- a proposed statutory figure ------------------------------------------
-- The scheme's rate on the wage base it is given, rounded to the sen, and no
-- more than the scheme's maximum when it has one (`least` passes over an empty
-- maximum). Zero for a scheme with no rule, and zero when the age is outside the
-- ages the scheme's employee share covers. An unknown age compares as neither,
-- so it keeps the share.
create or replace function private.hr_payroll_proposal(p_scheme text, p_wage_cents bigint, p_age int)
returns bigint language sql stable set search_path = public as $$
  select coalesce((
    select case
      when p_age < s.employee_from_age or p_age >= s.employee_until_age then 0
      else least(round(p_wage_cents * s.rate), s.max_cents)::bigint
    end
    from public.hr_statutory_rules s where s.scheme = p_scheme
  ), 0);
$$;
revoke all on function private.hr_payroll_proposal(text, bigint, int) from public, anon, authenticated;

-- The two-argument version this replaces, called from nowhere else.
drop function if exists private.hr_payroll_proposal(text, bigint);

-- ---- what follows from a payslip's basic pay and its lines ----------------
-- Works out what follows from a payslip's basic pay and its lines, in this one
-- place, and hands the payslip back:
--   gross       basic + earning lines - unpaid lines, never below zero;
--   EPF wages   the same, less the overtime lines;
--   EPF, SOCSO, EIS   the proposal on those wages at the employee's age on the
--               day before the wage month began, unless HR set the figure;
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
  -- EPF wages leave the system's overtime lines out; SOCSO and EIS wages include them.
  epf_wages := greatest(slip.basic_cents + earnings_epf - unpaid, 0);
  -- The age already reached before the month began: a birthday inside the month
  -- changes the shares from the next month.
  age_years := private.hr_payroll_age_on(slip.employee_id, slip.period_month - 1);

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

-- ---- drafts already worked out ----------------------------------------------
-- A draft made before this migration would otherwise keep its old figures until
-- someone clicked Recalculate, and Mark as paid does not recalculate. Paid runs
-- are left as they were.
do $$
begin
  perform private.hr_payroll_refresh_payslip(p.id)
  from public.hr_payslips p
  join public.hr_payroll_runs r on r.id = p.payroll_run_id
  where r.status = 'draft';
end $$;
