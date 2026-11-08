-- Lekiu payroll: above RM 20,000.00 the EPF shares are exact percentages, and the
-- total they add up to is rounded to the next ringgit (issue #423, part 1).
--
-- KWSP's note 2 on the mandatory contribution page: an employer is not allowed to
-- work the shares out on exact percentage except above RM 20,000.00, and then "the
-- total contribution which includes cents shall be rounded to the next ringgit".
-- The 4,411 band rows below that line already obey it, because each figure is the
-- rate on its band top rounded up and carries no sen. The eleven rate rows above it
-- did not: each share was rounded to the sen, so RM 20,000.01 answered 2,200.00 and
-- 2,400.00, a total of 4,600.00 where the Schedule says 4,601.00, and RM 25,000.55
-- answered 5,750.13 where it says 5,751.00.
--
-- Which share carries the odd sen. The employee's deduction is the part's own rate
-- to the sen (11% under Part A, 5.5% under Part C, nothing from 60 for a citizen), so
-- the employer's share takes the remainder and the two always add up to the rounded
-- total. Rounding both shares up instead would put the total a ringgit above the
-- note: RM 20,000.50 would read 2,201.00 + 2,401.00 = 4,602.00 where the note says
-- 4,601.00.
--
-- The combined rate is stored as a column rather than looked up from the other
-- payer's row, because it is a figure of the Schedule: 11% + 12% is 23% under Part A,
-- 5.5% + 6% is 11.5% under Part C, and Part E is the employer's 4% alone. Part F keeps
-- its sen: the Schedule prints it as one rate with no bands, and the note's rounding
-- is about the banded parts.

alter table public.hr_statutory_rules
  add column total_rate numeric(5,4) check (total_rate is null or total_rate > 0);

comment on column public.hr_statutory_rules.total_rate is
  'Both payers'' shares added together, on the rows where the Schedule rounds the total up to the next ringgit; null on every band row and on the schemes that keep a rate.';

-- The eleven rows above the last band, one per set: Part A below 60, Part C for a
-- permanent resident or a non-citizen from 60, and Part E for a citizen from 60.
update public.hr_statutory_rules
   set total_rate = case
     when employee_until_age = 60 then 0.23
     when citizenship = 'citizen' then 0.04
     else 0.115
   end
 where scheme = 'epf' and wage_from_cents = 2000001;

-- ---- a proposed statutory figure ------------------------------------------
-- As in 20261203090000, with the rounding the Schedule asks for above RM 20,000.00.
-- A row that carries a combined rate answers half of the rounded total: the employee
-- gets the part's own rate to the sen, and the employer gets what is left. Every other
-- row answers as it did, a band's amount or the rate rounded to the row's own five sen.
create or replace function private.hr_payroll_proposal(
  p_scheme text, p_wage_cents bigint, p_age int, p_citizenship text, p_payer text default 'employee')
returns bigint language sql stable set search_path = public as $$
  select coalesce((
    select case
             when s.total_rate is not null and s.payer = 'employee' then
               round(p_wage_cents * s.rate)
             when s.total_rate is not null then
               ceil(p_wage_cents * s.total_rate / 100) * 100
                 - round(p_wage_cents * (s.total_rate - s.rate))
             else
               least(
                 coalesce(s.amount_cents,
                          round(p_wage_cents * s.rate / s.round_to_cents) * s.round_to_cents),
                 s.max_cents)
           end::bigint
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
