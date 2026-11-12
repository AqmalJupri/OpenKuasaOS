-- Lekiu payroll: the EIS exemption at 57 is a fact about the person, so it is
-- stored against the person and read where the citizenship is read (issue #423,
-- part 2).
--
-- Act 800's Second Schedule stops the scheme at 60, and that is all the rule
-- table can say. The exemption it also carries is narrower: it is for an employee
-- who reaches 57 without having been insured before. Two 57 year olds differ by
-- whether they contributed, so an age cannot express it and a row in
-- hr_statutory_rules cannot either.
--
-- The column defaults false, so every payslip made before this migration is
-- unchanged. The flag only takes effect from 57, so a tick on the wrong row
-- cannot exempt someone still inside the scheme, and the band's own ceiling at
-- 60 keeps working beside it.
--
-- This file runs after 20261203090000_people_payroll_earning_type_mapping, which
-- rewrites the same function to read each line's wage base from
-- hr_earning_type_wages. Both changes are carried in one body below: restating
-- either one alone would be a silent revert of the other.

-- ---- the fact ---------------------------------------------------------------
alter table public.hr_employee_private
  add column eis_exempt boolean not null default false;

-- Owners and admins write the private record column by column; the new column joins the list.
grant update (eis_exempt) on public.hr_employee_private to authenticated;

-- ---- the payslip reads it ---------------------------------------------------
-- As in 20261128090000, with the two EIS figures asking the person's own record
-- before the rule table.
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
  eis_exempted boolean;
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
  select x.citizenship, x.eis_exempt into category, eis_exempted
  from public.hr_employee_private x where x.employee_id = slip.employee_id;

  select q.pcb_cents into last_pcb from public.hr_payslips q
  where q.employee_id = slip.employee_id and q.status = 'paid'
  order by q.period_month desc limit 1;

  update public.hr_payslips p
  set gross_cents = gross,
      epf_cents = case when 'epf' = any(p.set_by_hr) then p.epf_cents else private.hr_payroll_proposal('epf', epf_wages, age_years, category) end,
      socso_cents = case when 'socso' = any(p.set_by_hr) then p.socso_cents else private.hr_payroll_proposal('socso', socso_wages, age_years, category) end,
      -- An employee exempt at 57 pays no EIS on either side; the exemption is
      -- read only from 57, so a flag set early changes nothing.
      eis_cents = case
        when 'eis' = any(p.set_by_hr) then p.eis_cents
        when coalesce(eis_exempted, false) and coalesce(age_years, 0) >= 57 then 0
        else private.hr_payroll_proposal('eis', socso_wages, age_years, category)
      end,
      epf_employer_cents = private.hr_payroll_proposal('epf', epf_wages, age_years, category, 'employer'),
      socso_employer_cents = private.hr_payroll_proposal('socso', socso_wages, age_years, category, 'employer'),
      eis_employer_cents = case
        when coalesce(eis_exempted, false) and coalesce(age_years, 0) >= 57 then 0
        else private.hr_payroll_proposal('eis', socso_wages, age_years, category, 'employer')
      end,
      employer_recorded = true,
      pcb_cents = case when 'pcb' = any(p.set_by_hr) then p.pcb_cents else coalesce(last_pcb, 0) end,
      other_deductions_cents = deductions
  where p.id = slip.id
  returning p.* into slip;
  return slip;
end; $$;
revoke all on function private.hr_payroll_refresh_payslip(uuid) from public, anon, authenticated;
