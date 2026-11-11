-- Lekiu payroll: above RM 20,000.00 the employer's EPF share carries the
-- ringgit that KWSP rounds up, so the payslip's two shares add to the figure
-- KWSP's own note gives (issue #423, decision 3).
--
-- KWSP's mandatory-contribution page, note 2:
--
--   Employers are not allowed to calculate the employer's and employee's share
--   based on exact percentage EXCEPT for salaries that exceed RM20,000.00. The
--   total contribution which includes cents shall be rounded to the next
--   ringgit.
--
-- The schedule's band rows already obey it, because each band's figure is the
-- rate on the band top and carries no sen. Above the last band the wage is above
-- RM 20,000.00, so the shares are the exact percentage, and it is the total that
-- is rounded up. 20261203090000 stored those rows as a rate with
-- round_to_cents = 1, which rounds each share to the sen and leaves the total a
-- few sen short of the ringgit KWSP asks for:
--
--   wage        employee (11%)   employer (12%)   total      KWSP total
--   RM20,000.00 2,200.00         2,400.00         4,600.00   4,600.00
--   RM20,000.01 2,200.00         2,400.00         4,600.00   4,601.00
--   RM20,000.50 2,200.06         2,400.06         4,600.12   4,601.00
--   RM25,000.55 2,750.06         3,000.07         5,750.13   5,751.00
--
-- The split is the only one that also leaves the employee's deduction exact:
-- the employee share stays 11% of the wage to the sen, and the employer share is
-- the rounded-up total less that figure, so RM20,000.50 is 2,200.06 + 2,400.94.
-- Rounding each share up instead gives 4,602.00 at that wage, one ringgit over
-- the note's total, so it is not that.
--
-- Above the line every part follows the same note, not only Part A: Part C's
-- 5.5% and 6% and Part E's employer-only 4% total on the same rule, and Part E
-- has no employee share to subtract, so its employer figure is the rounded
-- total itself. Part F (a non-citizen's 2% at any age) is a rate row that starts
-- at RM 0.00 rather than above the last band, so nothing here moves it and its
-- total stays to the sen; that boundary is written down rather than closed here
-- because the note speaks about salaries above RM 20,000.00, not about Part F.
--
-- Nothing below or at RM 20,000.00 changes: those rows carry an amount and this
-- function still returns it. The employee's share does not move at any wage.

create or replace function private.hr_payroll_proposal(
  p_scheme text, p_wage_cents bigint, p_age int, p_citizenship text, p_payer text default 'employee')
returns bigint language plpgsql stable set search_path = public as $$
declare
  v_payer text := coalesce(p_payer, 'employee');
  v_citizenship text := coalesce(p_citizenship, 'citizen');
  v_wage bigint := coalesce(p_wage_cents, 0);
  v_row public.hr_statutory_rules%rowtype;
  v_employee_rate numeric;
  v_employee_round smallint;
  v_employee_cents bigint;
  v_total_cents bigint;
begin
  select * into v_row
  from public.hr_statutory_rules s
  where s.scheme = p_scheme
    and s.payer = v_payer
    and s.citizenship = v_citizenship
    and s.wage_from_cents <= v_wage
    and case
      when p_age is null then s.employee_from_age <= 18 and coalesce(s.employee_until_age, 1000) >= 60
      else p_age >= s.employee_from_age and p_age < coalesce(s.employee_until_age, 1000)
    end
  order by s.wage_from_cents desc
  limit 1;

  if not found then
    return 0;
  end if;

  -- Above the last band KWSP rounds the total, so the employer's figure is only
  -- known beside the employee's. The other share is read from its own row, and
  -- a category with no employee row (Part E from 60) subtracts nothing.
  if p_scheme = 'epf' and v_payer = 'employer'
     and v_row.rate is not null and v_row.wage_from_cents > 2000000 then
    select s.rate, s.round_to_cents into v_employee_rate, v_employee_round
    from public.hr_statutory_rules s
    where s.scheme = 'epf'
      and s.payer = 'employee'
      and s.citizenship = v_citizenship
      and s.wage_from_cents <= v_wage
      and case
        when p_age is null then s.employee_from_age <= 18 and coalesce(s.employee_until_age, 1000) >= 60
        else p_age >= s.employee_from_age and p_age < coalesce(s.employee_until_age, 1000)
      end
    order by s.wage_from_cents desc
    limit 1;

    v_employee_rate := coalesce(v_employee_rate, 0);
    v_employee_cents := round(v_wage * v_employee_rate / coalesce(v_employee_round, 1))
                        * coalesce(v_employee_round, 1);
    v_total_cents := (ceil(v_wage * (v_row.rate + v_employee_rate) / 100) * 100)::bigint;

    return v_total_cents - v_employee_cents;
  end if;

  return coalesce(
    least(
      coalesce(v_row.amount_cents,
               round(v_wage * v_row.rate / v_row.round_to_cents) * v_row.round_to_cents)::bigint,
      v_row.max_cents)::bigint,
    0);
end;
$$;
revoke all on function private.hr_payroll_proposal(text, bigint, int, text, text) from public, anon, authenticated;
