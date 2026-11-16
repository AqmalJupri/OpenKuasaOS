-- Lekiu EIS check: both EIS shares come from the Second Schedule of Act 800 band
-- table, not as a rate of wages (#423, part 1).
-- Read-only: every statement below is a select, and the block ends with RAISE, so even
-- if it grew a write nothing would survive. Read the message:
--   PEOPLE_PAYROLL_EIS_BANDS_CHECK PASSED ...   or   ... FAILED (n): <what went wrong>
--
-- How the figures are proved. Act 800 charges the employer and the employee the same
-- amount for a band, and that amount is 0.2% of the band's midpoint rounded up to the
-- next 5 sen. The 65 figures here are checked against two printed sources before they
-- are pinned: the Act's own deemed-wage table prints the total contribution for the 44
-- bands to RM4,000 and its above-RM4,000 row, and PERKESO's Second Schedule in
-- Employers' Circular No. 3/2024 prints rows 45 to 65 up to the RM6,000 ceiling.
do $$
declare
  fails text[] := '{}';
  n bigint; n2 bigint;
  t text;
begin
  -- ==== 1. the load ================================================================
  -- 260 band amounts: 65 bands for each of two payers in each of two citizenships.
  select count(*), count(*) filter (where amount_cents is not null)
    into n, n2
  from public.hr_statutory_rules where scheme = 'eis';
  if n <> 260 or n2 <> 260 then
    fails := array_append(fails, format('the EIS rows are %s, %s of them bands, expected 260 and 260', n, n2));
  end if;
  -- A band carries an amount and no rate, and no maximum, because a fixed amount needs neither.
  select count(*) into n from public.hr_statutory_rules
  where scheme = 'eis' and (rate is not null or max_cents is not null or round_to_cents <> 1);
  if n <> 0 then fails := array_append(fails, format('%s EIS bands still carry a rate, a maximum or a rounding step', n)); end if;
  -- Four sets, 65 rows each: two payers by two citizenships.
  select count(*) into n from (
    select payer, citizenship, count(*) as c
    from public.hr_statutory_rules where scheme = 'eis'
    group by 1, 2
  ) g where g.c = 65;
  select count(*) into n2 from (
    select payer, citizenship from public.hr_statutory_rules where scheme = 'eis' group by 1, 2
  ) g;
  if n <> 4 or n2 <> 4 then
    fails := array_append(fails, format('%s of the %s EIS sets hold 65 bands each, expected 4 of 4', n, n2));
  end if;
  -- EIS covers citizens and permanent residents from 18 to 60, and nobody else.
  select count(*) into n from public.hr_statutory_rules
  where scheme = 'eis'
    and (citizenship not in ('citizen', 'permanent_resident') or employee_from_age <> 18 or employee_until_age <> 60);
  if n <> 0 then fails := array_append(fails, format('%s EIS bands sit outside the 18 to 60 citizen and resident rows', n)); end if;

  -- ==== 2. the band edges ==========================================================
  -- The schedule steps at RM 30, 50, 70, 100, 140, 200, 300 and 400, then every RM 100
  -- to RM 6,000.00, and then one row above RM 6,000.00 that repeats the ceiling figure.
  select string_agg(s.wage_from_cents::text, ',' order by s.wage_from_cents) into t
  from public.hr_statutory_rules s
  where s.scheme = 'eis' and s.payer = 'employee' and s.citizenship = 'citizen';
  if t is distinct from (
    select string_agg(case when g.i = 0 then 1 else 1 + g.from_ringgit * 100 end::text, ',' order by g.i) from (
      select row_number() over () - 1 as i, w as from_ringgit from unnest(array[
        0, 30, 50, 70, 100, 140, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
        1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600,
        2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000,
        4100, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400,
        5500, 5600, 5700, 5800, 5900, 6000
      ]) with ordinality as u(w, i)
    ) g
  ) then
    fails := array_append(fails, format('the EIS bands start at %s', t));
  end if;

  -- ==== 3. the 65 printed figures, pinned =========================================
  -- The schedule takes the same amount from the employer and the employee, and a citizen
  -- and a permanent resident are charged alike, so section 5 proves the other three sets
  -- carry these numbers and 65 figures pin all 260 rows.
  select string_agg(s.amount_cents::text, '; ' order by s.wage_from_cents) into t
  from public.hr_statutory_rules s
  where s.scheme = 'eis' and s.payer = 'employee' and s.citizenship = 'citizen';
  if t is distinct from '5; 10; 15; 20; 25; 35; '
        || '50; 70; 90; 110; 130; 150; '
        || '170; 190; 210; 230; 250; 270; '
        || '290; 310; 330; 350; 370; 390; '
        || '410; 430; 450; 470; 490; 510; '
        || '530; 550; 570; 590; 610; 630; '
        || '650; 670; 690; 710; 730; 750; '
        || '770; 790; 810; 830; 850; 870; '
        || '890; 910; 930; 950; 970; 990; '
        || '1010; 1030; 1050; 1070; 1090; 1110; '
        || '1130; 1150; 1170; 1190; 1190'
  then fails := array_append(fails, format('the EIS figures are %s', t)); end if;

  -- ==== 4. the figures come out of the Act's own rule ==============================
  -- The 65 figures above were read off a scan of the circular, so they are also proved
  -- against the arithmetic the Schedule was built from: 0.2% of the band's midpoint,
  -- rounded up to the next 5 sen. The midpoint is the middle of the band's own bounds, so
  -- the band above RM200.00 and up to RM300.00 is RM250 and not RM250.005, which is what
  -- reproduces the printed figure exactly. The row above RM6,000.00 is the exception the
  -- schedule prints: it repeats the top band's figure instead of one derived from its own
  -- open top.
  select count(*) into n from (
    select b.amount_cents as amount,
           ceil(0.002 * (((b.wage_from_cents - 1) + b.band_top)::numeric / 2) / 5) * 5 as derived
    from (
      select s.wage_from_cents, s.amount_cents,
             coalesce(lead(s.wage_from_cents) over (order by s.wage_from_cents) - 1,
                      s.wage_from_cents) as band_top
      from public.hr_statutory_rules s
      where s.scheme = 'eis' and s.payer = 'employee' and s.citizenship = 'citizen'
    ) b
    where b.wage_from_cents < 600001
  ) g where g.amount <> g.derived;
  if n <> 0 then
    fails := array_append(fails, format('%s of the 64 bands are not 0.2%% of their midpoint rounded up to 5 sen', n));
  end if;
  select count(*) into n from public.hr_statutory_rules s
  where s.scheme = 'eis' and s.payer = 'employee' and s.citizenship = 'citizen'
    and s.wage_from_cents = 600001
    and s.amount_cents <> (
      select max(t2.amount_cents) from public.hr_statutory_rules t2
      where t2.scheme = 'eis' and t2.payer = 'employee' and t2.citizenship = 'citizen'
        and t2.wage_from_cents < 600001);
  if n <> 0 then
    fails := array_append(fails, 'the row above RM6,000.00 does not repeat the top band figure');
  end if;

  -- ==== 5. both payers and both citizenships carry the same figures ================
  select count(*) into n from (
    select s.wage_from_cents,
           count(distinct s.amount_cents) as distinct_amounts, count(*) as rows_here
    from public.hr_statutory_rules s
    where s.scheme = 'eis'
    group by 1
  ) g where g.distinct_amounts <> 1 or g.rows_here <> 4;
  if n <> 0 then fails := array_append(fails, format('%s EIS bands differ between payers or citizenships', n)); end if;

  -- ==== 6. the figures only go up as the wage goes up ==============================
  select count(*) into n from (
    select s.amount_cents,
           lag(s.amount_cents) over (partition by s.payer, s.citizenship order by s.wage_from_cents) as previous
    from public.hr_statutory_rules s where s.scheme = 'eis'
  ) g where g.previous is not null and g.amount_cents < g.previous;
  if n <> 0 then fails := array_append(fails, format('%s EIS bands fall as the wage rises', n)); end if;

  -- ==== 7. the function returns the band, at its edges and inside it ===============
  -- Each pair is a wage in cents and the figure the schedule prints for the band it falls
  -- in: the first sen of a band, its top, one sen after it, a wage inside a band, and the
  -- ceiling with the row above it.
  if private.hr_payroll_proposal('eis', 1, 30, 'citizen', 'employee') <> 5
     or private.hr_payroll_proposal('eis', 3000, 30, 'citizen', 'employee') <> 5
     or private.hr_payroll_proposal('eis', 3001, 30, 'citizen', 'employee') <> 10
     or private.hr_payroll_proposal('eis', 3500, 30, 'citizen', 'employee') <> 10
     or private.hr_payroll_proposal('eis', 29901, 30, 'citizen', 'employee') <> 50
     or private.hr_payroll_proposal('eis', 30001, 30, 'citizen', 'employee') <> 70
     or private.hr_payroll_proposal('eis', 313327, 30, 'citizen', 'employee') <> 630
     or private.hr_payroll_proposal('eis', 380000, 30, 'citizen', 'employee') <> 750
     or private.hr_payroll_proposal('eis', 500000, 30, 'citizen', 'employee') <> 990
     or private.hr_payroll_proposal('eis', 500001, 30, 'citizen', 'employee') <> 1010
     or private.hr_payroll_proposal('eis', 594000, 30, 'citizen', 'employee') <> 1190
     or private.hr_payroll_proposal('eis', 600000, 30, 'citizen', 'employee') <> 1190
     or private.hr_payroll_proposal('eis', 600001, 30, 'citizen', 'employee') <> 1190
     or private.hr_payroll_proposal('eis', 100000000, 30, 'citizen', 'employee') <> 1190 then
    fails := array_append(fails, 'the EIS figure is not the band the wage falls in');
  end if;
  -- The employer pays the same figure as the employee, which is what the schedule prints.
  if private.hr_payroll_proposal('eis', 313327, 30, 'citizen', 'employer') <> 630
     or private.hr_payroll_proposal('eis', 600000, 30, 'citizen', 'employer') <> 1190
     or private.hr_payroll_proposal('eis', 1, 30, 'permanent_resident', 'employer') <> 5 then
    fails := array_append(fails, 'the employer EIS figure is not the employee figure');
  end if;

  -- ==== 8. who EIS covers has not moved ============================================
  -- A wage of zero matches no band, an employee under 18 or from 60 pays nothing, and EIS
  -- does not reach a non-citizen. The exemption at 57 is a contribution history and stays
  -- open in #423, so nothing here asserts anything about it.
  if private.hr_payroll_proposal('eis', 0, 30, 'citizen', 'employee') <> 0
     or private.hr_payroll_proposal('eis', 300000, 17, 'citizen', 'employee') <> 0
     or private.hr_payroll_proposal('eis', 300000, 60, 'citizen', 'employee') <> 0
     or private.hr_payroll_proposal('eis', 300000, 30, 'non_citizen', 'employee') <> 0
     or private.hr_payroll_proposal('eis', 300000, 30, 'non_citizen_before_1998', 'employee') <> 0 then
    fails := array_append(fails, 'a wage, age or citizenship outside the EIS rows is being charged');
  end if;

  raise exception 'PEOPLE_PAYROLL_EIS_BANDS_CHECK %', case
    when cardinality(fails) > 0 then format('FAILED (%s): %s', cardinality(fails), array_to_string(fails, '; '))
    else 'PASSED (everything rolled back)'
  end;
end $$;
