-- Lekiu payroll: an employee who leaves before the month ends is paid the days
-- they worked, under section 18A(b) of the Employment Act 1955 (in force since
-- 1 January 2023), the same "monthly wages / days of the wage period x days
-- eligible" rule the joiner and unpaid-leave figures already follow (issue
-- #421, after #404).
--
-- The record needs the end date first: hr_employees held join_date and status
-- only, so a run paid a leaver the whole month and HR worked the last month out
-- by hand. left_date is that date, and it is deliberately not a status change:
--
--   * private.hr_payroll_fill and private.hr_payroll_skipped both require
--     e.status = 'active', so flipping the status in the same write gives the
--     final month neither a payslip nor a skipped entry, and no later write can
--     make it, because the fill never sees that employee again;
--   * the fill instead drops an employee whose left_date falls before the run's
--     month, which is what a month after the leaving date needs, and keeps them
--     for the month they left;
--   * status stays the record of "still on the books", which HR sets when the
--     paperwork is done, on its own.
--
-- What the payslip does with it:
--
--   eligible days  the days of the month from the 1st (or the join date) to the
--                  last day of employment, both counted;
--   unpaid days    approved unpaid leave inside those eligible days only, so
--                  leave after the last day is not counted;
--   pay            basic x (eligible - unpaid) / days in the month, rounded
--                  once, as before;
--   the line       one unpaid line carries the days that are not paid because
--                  the person was not employed, labelled with the boundary that
--                  caused it: "Left 20 Mar 2025 (20 of 31 days)", and both
--                  boundaries when someone joins and leaves inside one month.
--                  Its source is the new 'leaver' when the leaving date ends
--                  the window and 'joiner' when only the join date does.
--
-- Overtime worked after the last day is no longer paid: the builder took every
-- approved record on or before the month's last day, whatever the leaving date.
--
-- A month entirely after the last day is skipped rather than paid as zero, and
-- the check file pins a mid-month leaver, a join and leave inside one month, a
-- leaver with unpaid leave, and a last day on the month's last day.

-- ---- the last day of employment ------------------------------------------------
alter table public.hr_employees add column if not exists left_date date;
-- A last day before the first day would pay nothing for a month that was worked,
-- so the record refuses it whatever wrote it: the form, the chat tools, a script.
alter table public.hr_employees drop constraint if exists hr_employees_left_after_join;
alter table public.hr_employees add constraint hr_employees_left_after_join
  check (left_date is null or join_date is null or left_date >= join_date);

-- ---- the line a leaver writes ---------------------------------------------------
-- An unpaid line, as the joiner line is, with a source that says which boundary
-- left the days unpaid.
alter table public.hr_payslip_lines drop constraint if exists hr_payslip_lines_source_check;
alter table public.hr_payslip_lines add constraint hr_payslip_lines_source_check
  check (source in ('hr','overtime','unpaid_leave','joiner','leaver'));

alter table public.hr_payslip_lines drop constraint if exists hr_payslip_lines_source_kind;
alter table public.hr_payslip_lines add constraint hr_payslip_lines_source_kind check (
  (source = 'overtime' and kind = 'earning')
  or (source in ('unpaid_leave','joiner','leaver') and kind = 'unpaid')
  or (source = 'hr' and kind in ('earning','deduction')));

-- ---- unpaid days, bounded by the last day --------------------------------------
-- Calendar days of approved unpaid leave in the month, from the join date when
-- that falls inside it and up to the last day of employment, leaving out the
-- workspace's public holidays. A day two requests cover counts once; a half day
-- counts 0.5. Leave after the last day is not counted.
create or replace function private.hr_payroll_unpaid_days(p_org uuid, p_employee uuid, p_month date)
returns numeric language sql stable set search_path = public as $$
  with bounds as (
    select greatest(p_month, coalesce(e.join_date, p_month)) as first_day,
           least((p_month + interval '1 month')::date - 1,
                 coalesce(e.left_date, (p_month + interval '1 month')::date - 1)) as last_day
    from public.hr_employees e where e.id = p_employee
  ), days as (
    select d::date as day, max(case when r.half_day then 0.5 else 1 end) as part
    from bounds b
    join public.hr_leave_requests r
      on r.employee_id = p_employee and r.org_id = p_org
     and r.leave_type = 'unpaid' and r.status = 'approved'
     and r.start_date <= b.last_day and r.end_date >= b.first_day
    cross join lateral generate_series(greatest(r.start_date, b.first_day), least(r.end_date, b.last_day), interval '1 day') d
    where not exists (
      select 1 from public.hr_public_holidays h where h.org_id = p_org and h.holiday_date = d::date)
    group by d::date
  )
  select coalesce(sum(part), 0) from days;
$$;
revoke all on function private.hr_payroll_unpaid_days(uuid, uuid, date) from public, anon, authenticated;

-- ---- building a draft payslip ---------------------------------------------------
create or replace function private.hr_payroll_build_payslip(p_payslip uuid)
returns void language plpgsql set search_path = public as $$
declare
  slip public.hr_payslips;
  month_end date;
  days_in_month int;
  salary bigint;
  joined date;
  left_on date;
  first_day date;
  last_day date;
  employed int;
  days numeric;
  pay bigint;
  boundary bigint := 0;
  unpaid bigint;
begin
  select p.* into slip from public.hr_payslips p where p.id = p_payslip;
  month_end := (slip.period_month + interval '1 month')::date - 1;
  days_in_month := extract(day from month_end)::int;
  select x.base_salary_cents into salary from public.hr_employee_private x where x.employee_id = slip.employee_id;
  salary := coalesce(salary, 0);
  select e.join_date, e.left_date into joined, left_on from public.hr_employees e where e.id = slip.employee_id;

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

  -- The days this payslip pays for: from the 1st (or the join date) to the last
  -- day of employment, which is the month's last day unless the record says
  -- otherwise. Pay is worked out over those days and rounded once.
  first_day := case when joined > slip.period_month and joined <= month_end then joined else slip.period_month end;
  last_day := month_end;
  if left_on is not null and left_on < last_day then last_day := left_on; end if;
  employed := greatest(last_day - first_day + 1, 0);
  days := least(private.hr_payroll_unpaid_days(slip.org_id, slip.employee_id, slip.period_month), employed::numeric);
  pay := round(salary::numeric * (employed - days) / days_in_month)::bigint;

  -- What the days outside the window leave unpaid, worked out once with the pay
  -- above so the two lines and the pay add up to basic exactly.
  boundary := salary - round(salary::numeric * employed / days_in_month)::bigint;
  if boundary > 0 then
    insert into public.hr_payslip_lines (org_id, payslip_id, kind, source, label, amount_cents, created_at)
    values (slip.org_id, slip.id, 'unpaid',
            case when left_on is not null and left_on < month_end then 'leaver' else 'joiner' end,
            case
              when joined > slip.period_month and left_on is not null and left_on < month_end then
                'Joined ' || to_char(joined, 'FMDD Mon YYYY') || ', left ' || to_char(left_on, 'FMDD Mon YYYY') ||
                ' (' || employed || ' of ' || days_in_month || ' days)'
              when left_on is not null and left_on < month_end then
                'Left ' || to_char(left_on, 'FMDD Mon YYYY') || ' (' || employed || ' of ' || days_in_month || ' days)'
              else
                'Joined ' || to_char(joined, 'FMDD Mon YYYY') || ' (' || employed || ' of ' || days_in_month || ' days)'
            end,
            boundary, now());
  end if;

  unpaid := salary - pay - boundary;
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
      and r.amount_cents > 0 and r.work_date <= last_day
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

-- ---- who a run fills --------------------------------------------------------------
-- A payslip for every employee of the workspace who is active, has a salary
-- above zero, joined on or before the last day of the month (or has no join
-- date) and had not left before the month began (or has no leaving date) and is
-- not in the run yet; then every payslip of the run, old and new, is built and
-- worked out again. It never removes a payslip. Returns how many it added.
create or replace function private.hr_payroll_fill(p_run public.hr_payroll_runs)
returns int language plpgsql set search_path = public as $$
declare
  month_end date := (p_run.period_month + interval '1 month')::date - 1;
  added int;
  slip_id uuid;
begin
  with made as (
    insert into public.hr_payslips (org_id, employee_id, payroll_run_id, period_month, basic_cents, gross_cents)
    select p_run.org_id, e.id, p_run.id, p_run.period_month, x.base_salary_cents, x.base_salary_cents
    from public.hr_employees e
    join public.hr_employee_private x on x.employee_id = e.id
    where e.org_id = p_run.org_id and e.status = 'active' and x.base_salary_cents > 0
      and (e.join_date is null or e.join_date <= month_end)
      and (e.left_date is null or e.left_date >= p_run.period_month)
      and not exists (
        select 1 from public.hr_payslips p
        where p.employee_id = e.id and p.period_month = p_run.period_month
      )
    order by e.id
    returning 1
  )
  select count(*)::int into added from made;

  for slip_id in
    select p.id from public.hr_payslips p where p.payroll_run_id = p_run.id order by p.employee_id
  loop
    perform private.hr_payroll_build_payslip(slip_id);
    perform private.hr_payroll_refresh_payslip(slip_id);
  end loop;
  return added;
end; $$;
revoke all on function private.hr_payroll_fill(public.hr_payroll_runs) from public, anon, authenticated;

-- Who a run left out for want of a salary: every active employee of the
-- workspace who joined on or before the last day of the month (or has no join
-- date), had not left before the month began (or has no leaving date), has no
-- salary on file (none, or zero) and has no payslip in the run, by name.
-- Someone who joins after the month, or left before it, is not listed: they
-- would not be paid for it with a salary either.
create or replace function private.hr_payroll_skipped(p_run public.hr_payroll_runs)
returns jsonb language sql stable set search_path = public as $$
  select coalesce(jsonb_agg(
    jsonb_build_object('employee_id', e.id, 'name', e.name, 'reason', 'no_salary') order by e.name, e.id
  ), '[]'::jsonb)
  from public.hr_employees e
  left join public.hr_employee_private x on x.employee_id = e.id
  where e.org_id = p_run.org_id and e.status = 'active' and coalesce(x.base_salary_cents, 0) = 0
    and (e.join_date is null or e.join_date <= (p_run.period_month + interval '1 month')::date - 1)
    and (e.left_date is null or e.left_date >= p_run.period_month)
    and not exists (
      select 1 from public.hr_payslips p
      where p.employee_id = e.id and p.payroll_run_id = p_run.id
    );
$$;
revoke all on function private.hr_payroll_skipped(public.hr_payroll_runs) from public, anon, authenticated;
