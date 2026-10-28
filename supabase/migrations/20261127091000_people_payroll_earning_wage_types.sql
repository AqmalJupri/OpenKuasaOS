-- Lekiu payroll: an earning line says what kind of earning it is, so EPF wages
-- and SOCSO and EIS wages are each built from the lines that belong in them.
--
-- The rest of issue #402. The fixed rules were already in (a rate and a cap, the
-- age bands, the overtime rule and citizenship); what the record could not say
-- was what the money on a line is for. Every line HR added counted towards all
-- three schemes, so an annual bonus raised SOCSO and EIS and a travel allowance
-- raised EPF, which the statutes do not allow.
--
-- The types, and what each one counts towards:
--   ordinary          EPF, SOCSO and EIS;
--   bonus             EPF only: an annual bonus is not SOCSO or EIS wages;
--   travel_allowance  none: a travelling allowance is neither;
--   gratuity          none: a gratuity is neither;
--   service_charge    SOCSO and EIS only: a service charge is not EPF wages.
--
-- Overtime is not on that list. The system makes those lines from approved
-- overtime and `source` already says so, which is how EPF wages left them out
-- before this migration; the rule stays where it was and overtime stays in the
-- SOCSO and EIS base.
--
-- Sources: the KWSP Third Schedule and the EPF Act 1991 on wages, and PERKESO's
-- contribution tables and the Employees' Social Security Act 1969 on wages,
-- both linked on #402. The list of what each scheme leaves out is the one on
-- that issue: EPF leaves out overtime, service charge, gratuity and travel
-- allowance; SOCSO and EIS leave out an annual bonus, gratuity and travel
-- allowance. A service charge stays in the SOCSO and EIS base because that list
-- does not name it.
--
-- An ordinary line is the default and moves the same figures every line moved
-- before this migration, so no payslip changes until someone says what a line
-- is. A type is for the lines HR writes: the system's own unpaid-leave and
-- joiner lines are not earnings, and a check constraint keeps them ordinary.
--
-- Not attempted here, and still open in #402: the banded tables themselves (a
-- rate and a cap is still what the money is worked out from) and the EIS
-- exemption at 57, which needs a contribution history this record does not keep.
--
-- The save function takes the type as a sixth argument with a default, so every
-- five-argument call keeps working and counts the line as ordinary pay.

-- ---- what kind of earning a line is ----------------------------------------
alter table public.hr_payslip_lines
  add column earning_type text not null default 'ordinary'
    check (earning_type in ('ordinary','bonus','gratuity','travel_allowance','service_charge'));

-- Only a line that is not an earning carries no type of its own.
alter table public.hr_payslip_lines
  add constraint hr_payslip_lines_earning_type check (kind = 'earning' or earning_type = 'ordinary');

-- ---- what follows from a payslip's basic pay and its lines ----------------
-- The same refresh as before, with a base per scheme: EPF wages leave the
-- overtime lines, a service charge, a gratuity and a travel allowance out;
-- SOCSO and EIS wages leave an annual bonus, a gratuity and a travel allowance
-- out and keep overtime and a service charge in. Unpaid lines come off every
-- base, as they came off gross.
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
      pcb_cents = case when 'pcb' = any(p.set_by_hr) then p.pcb_cents else coalesce(last_pcb, 0) end,
      other_deductions_cents = deductions
  where p.id = slip.id
  returning p.* into slip;
  return slip;
end; $$;
revoke all on function private.hr_payroll_refresh_payslip(uuid) from public, anon, authenticated;

-- ---- a line, with what kind of earning it is -------------------------------
-- The sixth argument is new and defaulted: a five-argument call (the chat tools,
-- an older client) writes an ordinary line, which is what it wrote before.
drop function if exists public.hr_save_payslip_line(uuid, uuid, text, text, bigint);
create function public.hr_save_payslip_line(
  p_payslip uuid, p_line uuid, p_kind text, p_label text, p_amount_cents bigint,
  p_earning_type text default 'ordinary')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  run public.hr_payroll_runs;
  slip public.hr_payslips;
  line public.hr_payslip_lines;
  title text := trim(p_label);
  earning_type text := coalesce(p_earning_type, 'ordinary');
begin
  run := private.hr_payroll_held_run(null, p_payslip, null);
  if run.status <> 'draft' then raise exception 'PAYROLL_NOT_DRAFT'; end if;
  select p.* into slip from public.hr_payslips p where p.id = p_payslip and p.payroll_run_id = run.id;
  if not found then raise exception 'PAYROLL_NOT_FOUND'; end if;
  if p_line is not null then
    select l.* into line from public.hr_payslip_lines l
    where l.id = p_line and l.payslip_id = slip.id;
    if not found then raise exception 'PAYROLL_NOT_FOUND'; end if;
    if line.source <> 'hr' then raise exception 'PAYROLL_SYSTEM_LINE'; end if;
  end if;
  if p_kind is null or p_kind not in ('earning','deduction')
     or title is null or char_length(title) not between 1 and 80
     or p_amount_cents is null or p_amount_cents <= 0 or p_amount_cents > 100000000000 then
    raise exception 'PAYROLL_BAD_INPUT';
  end if;
  -- A deduction is not an earning, so it carries no earning type.
  if p_kind = 'deduction' then
    earning_type := 'ordinary';
  elsif earning_type not in ('ordinary','bonus','gratuity','travel_allowance','service_charge') then
    raise exception 'PAYROLL_BAD_INPUT';
  end if;

  if p_line is null then
    insert into public.hr_payslip_lines (org_id, payslip_id, kind, source, earning_type, label, amount_cents)
    values (slip.org_id, slip.id, p_kind, 'hr', earning_type, title, p_amount_cents)
    returning * into line;
  else
    update public.hr_payslip_lines l
    set kind = p_kind, earning_type = earning_type, label = title, amount_cents = p_amount_cents
    where l.id = line.id
    returning l.* into line;
  end if;
  slip := private.hr_payroll_refresh_payslip(slip.id);

  return jsonb_build_object(
    'payslip', private.hr_payslip_json(slip),
    'line', jsonb_build_object(
      'id', line.id, 'kind', line.kind, 'source', line.source, 'earning_type', line.earning_type,
      'label', line.label, 'amount_cents', line.amount_cents));
end; $$;
revoke all on function public.hr_save_payslip_line(uuid, uuid, text, text, bigint, text) from public, anon;
grant execute on function public.hr_save_payslip_line(uuid, uuid, text, text, bigint, text) to authenticated;

-- ---- drafts already worked out ----------------------------------------------
-- Nothing moves for a draft whose lines are all ordinary pay, but a draft made
-- before this migration is worked out again so the record and its figures agree.
-- Paid payslips are untouched.
do $$
begin
  perform private.hr_payroll_refresh_payslip(p.id)
  from public.hr_payslips p
  join public.hr_payroll_runs r on r.id = p.payroll_run_id
  where r.status = 'draft';
end $$;
