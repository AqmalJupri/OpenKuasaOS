-- Lekiu payroll: a month that is not worked in full follows section 18A of the
-- Employment Act 1955, in force since 1 January 2023 (Employment (Amendment)
-- Act 2022), where the record already says enough to apply it (issue #404).
--
-- The rule: for a monthly-paid employee the wage period is the calendar month,
-- so one day of it is the monthly wages divided by the days in that month, and
-- the pay for an incomplete month is the monthly wages times the eligible days
-- over the days in the wage period, rounded once at the end.
--
--   unpaid leave   basic x unpaid days / days in the month, capped so the unpaid
--                  lines together never exceed basic;
--   joiner         basic - basic x days from the join date to the month end /
--                  days in the month.
--
-- Before this, unpaid leave came off at basic / 26 per working day, which is the
-- s.60I ordinary rate of pay for overtime, rest days and public holidays, not the
-- s.18A denominator, and a joiner was pro-rated by the workspace's working days.
-- On a 31 day month with two unpaid working days that took off RM230.77 where the
-- Act gives RM193.55, and a joiner on 16 March was paid RM1,363.64 where the Act
-- gives RM1,451.61.
--
-- The line now says which days it used: "Unpaid leave, 2 of 31 days" and
-- "Joined 16 Mar 2026 (16 of 31 days)", so the figure can be checked against the
-- Act without working the denominator out again.
--
-- A month worked in full is not touched by any of this. Still open in #404, and
-- not attempted here: an employee who leaves before the month ends needs an end
-- date on the employee, and hr_employees has join_date and status only.
--
-- A paid payslip is a record of what was paid and never moves: only a draft is
-- rebuilt, as before.
create or replace function private.hr_payroll_build_payslip(p_payslip uuid)
returns void language plpgsql set search_path = public as $$
declare
  slip public.hr_payslips;
  month_end date;
  days_in_month int;
  salary bigint;
  joined date;
  joiner bigint := 0;
  days numeric;
  unpaid bigint;
begin
  select p.* into slip from public.hr_payslips p where p.id = p_payslip;
  month_end := (slip.period_month + interval '1 month')::date - 1;
  days_in_month := extract(day from month_end)::int;
  select x.base_salary_cents into salary from public.hr_employee_private x where x.employee_id = slip.employee_id;
  salary := coalesce(salary, 0);
  select e.join_date into joined from public.hr_employees e where e.id = slip.employee_id;

  -- Every overtime record this is about to let go or to take is held first,
  -- in order of id: the order hr_mark_payroll_paid holds them in, so two
  -- drafts being worked on at once cannot each wait for the other.
  perform 1 from public.hr_overtime_records r
  where r.employee_id = slip.employee_id and r.org_id = slip.org_id
    and (r.payslip_id = slip.id or (r.status = 'approved' and r.payslip_id is null))
  order by r.id
  for update;

  update public.hr_overtime_records r set payslip_id = null where r.payslip_id = slip.id;
  delete from public.hr_payslip_lines l where l.payslip_id = slip.id and l.source <> 'hr';
  update public.hr_payslips p set basic_cents = salary where p.id = slip.id;

  if joined > slip.period_month and joined <= month_end then
    joiner := salary - round(salary::numeric * (month_end - joined + 1) / days_in_month)::bigint;
    if joiner > 0 then
      insert into public.hr_payslip_lines (org_id, payslip_id, kind, source, label, amount_cents, created_at)
      values (slip.org_id, slip.id, 'unpaid', 'joiner',
              'Joined ' || to_char(joined, 'FMDD Mon YYYY') || ' (' || (month_end - joined + 1) || ' of ' || days_in_month || ' days)',
              joiner, now());
    end if;
  end if;

  days := private.hr_payroll_unpaid_days(slip.org_id, slip.employee_id, slip.period_month);
  unpaid := least(round(salary::numeric * days / days_in_month)::bigint, salary - joiner);
  if unpaid > 0 then
    insert into public.hr_payslip_lines (org_id, payslip_id, kind, source, label, amount_cents, created_at)
    values (slip.org_id, slip.id, 'unpaid', 'unpaid_leave',
            'Unpaid leave, ' || trim_scale(days) || ' of ' || days_in_month || ' days',
            unpaid, now() + interval '1 microsecond');
  end if;

  with taken as (
    update public.hr_overtime_records r set payslip_id = slip.id
    where r.employee_id = slip.employee_id and r.org_id = slip.org_id
      and r.status = 'approved' and r.payslip_id is null
      and r.amount_cents > 0 and r.work_date <= month_end
    returning r.id, r.work_date, r.hours, r.amount_cents
  )
  insert into public.hr_payslip_lines (org_id, payslip_id, kind, source, label, amount_cents, overtime_record_id, created_at)
  select slip.org_id, slip.id, 'earning', 'overtime',
    'Overtime, ' || to_char(t.work_date, 'FMDD Mon YYYY') || ', ' || trim_scale(t.hours) || ' h',
    t.amount_cents, t.id,
    now() + (1 + row_number() over (order by t.work_date, t.id)) * interval '1 microsecond'
  from taken t;
end; $$;
revoke all on function private.hr_payroll_build_payslip(uuid) from public, anon, authenticated;
