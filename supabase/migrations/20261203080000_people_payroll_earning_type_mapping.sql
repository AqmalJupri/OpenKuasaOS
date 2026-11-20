-- The earning type to scheme mapping, in one place (asked for on #422: one mapping instead of five).
--
-- What a line counts towards was written out in five places: the column check on
-- hr_payslip_lines.earning_type, the validation in hr_save_payslip_line, the two filters in
-- private.hr_payroll_refresh_payslip, PAYSLIP_EARNING_TYPES and EARNING_TYPE_OPTIONS. They agree
-- today, and adding a type such as a commission means changing all five without a way to notice
-- one left behind. The rows live in public.hr_earning_type_wages, the column points at it, the
-- refresh reads the two flags, and the app's one const is checked against this seed by
-- tests/people-payroll-earning-type-mapping.test.ts.

create table public.hr_earning_type_wages (
  earning_type text primary key,
  -- The type an HR line carries, and whether that amount is EPF wages and SOCSO and EIS wages.
  in_epf boolean not null,
  in_socso boolean not null
);
insert into public.hr_earning_type_wages (earning_type, in_epf, in_socso) values
  ('ordinary', true, true),
  ('bonus', true, false),
  ('travel_allowance', false, false),
  ('service_charge', false, true),
  ('gratuity', false, false);

-- Read, never written: the app carries the same rows and offers no screen for this table.
alter table public.hr_earning_type_wages enable row level security;
create policy hr_earning_type_wages_select on public.hr_earning_type_wages for select to authenticated using (true);
revoke all on public.hr_earning_type_wages from anon, authenticated;
grant select on public.hr_earning_type_wages to authenticated;

-- ---- a line's type comes from the table ------------------------------------
-- The inline check is replaced by the reference, so a type the table does not hold cannot be
-- stored at all. `hr_payslip_lines_earning_type` (a non-earning line carries ordinary) stays.
alter table public.hr_payslip_lines
  drop constraint hr_payslip_lines_earning_type_check;
alter table public.hr_payslip_lines
  add constraint hr_payslip_lines_earning_type_fkey
    foreign key (earning_type) references public.hr_earning_type_wages (earning_type);

-- ---- the refresh reads the flags -------------------------------------------
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
           and w.in_epf), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'earning' and w.in_socso), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'unpaid'), 0),
         coalesce(sum(l.amount_cents) filter (where l.kind = 'deduction'), 0)
  into earnings, earnings_epf, earnings_socso, unpaid, deductions
  from public.hr_payslip_lines l
  -- Which wage base takes a line is the row's own two flags, read here rather than restated.
  join public.hr_earning_type_wages w on w.earning_type = l.earning_type
  where l.payslip_id = slip.id;
  gross := greatest(slip.basic_cents + earnings - unpaid, 0);
  -- EPF wages: every earning row whose in_epf is set, and no overtime line.
  epf_wages := greatest(slip.basic_cents + earnings_epf - unpaid, 0);
  -- SOCSO and EIS wages: every earning row whose in_socso is set, overtime included.
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

-- ---- the save function asks the table whether the type exists --------------
create or replace function public.hr_save_payslip_line(
  p_payslip uuid, p_line uuid, p_kind text, p_label text, p_amount_cents bigint,
  p_earning_type text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  run public.hr_payroll_runs;
  slip public.hr_payslips;
  line public.hr_payslip_lines;
  title text := trim(p_label);
  line_type text;
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
  -- A deduction is not an earning, so it carries no earning type. An earning
  -- that names none keeps the type its line has, or is ordinary pay when new.
  line_type := coalesce(p_earning_type, line.earning_type, 'ordinary');
  if p_kind = 'deduction' then
    line_type := 'ordinary';
  elsif not exists (select 1 from public.hr_earning_type_wages w where w.earning_type = line_type) then
    raise exception 'PAYROLL_BAD_INPUT';
  end if;

  if p_line is null then
    insert into public.hr_payslip_lines (org_id, payslip_id, kind, source, earning_type, label, amount_cents)
    values (slip.org_id, slip.id, p_kind, 'hr', line_type, title, p_amount_cents)
    returning * into line;
  else
    update public.hr_payslip_lines l
    set kind = p_kind, earning_type = line_type, label = title, amount_cents = p_amount_cents
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
