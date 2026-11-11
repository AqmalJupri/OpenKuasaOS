-- Lekiu EPF above RM 20,000.00 check: the total contribution is rounded up to the
-- next ringgit, and the employer's share carries that ringgit (#423, decision 3).
-- Read-only: every statement below is a select, and the block ends with RAISE, so
-- even if it grew a write nothing would survive. Read the message:
--   PEOPLE_PAYROLL_EPF_TOTAL_ROUNDING_CHECK PASSED ...   or   ... FAILED (n): <what went wrong>
--
-- The rule is KWSP's own note, so it is proved against the note and not against the
-- code: "The total contribution which includes cents shall be rounded to the next
-- ringgit" (Note 2, KWSP mandatory contribution). Above the last band the shares are
-- the exact percentage, so employee + employer has to equal
-- ceil(23% of the wage to the next ringgit) for Part A, ceil(11.5%) for Part C and
-- ceil(4%) for Part E, at every wage above RM 20,000.00.
--
-- The employee's share is checked separately and has to stay exactly 11% of the wage
-- to the sen, because that is the deduction the employee sees and KWSP's note does
-- not round it. Two shares that satisfy both are forced: the employer's figure is
-- the rounded total less the employee's.

do $$
declare
  fails text[] := '{}';
  n bigint;
  w bigint;
  e bigint;
  r bigint;
  total bigint;
begin
  -- ==== 1. the four wages in the measurement ======================================
  -- KWSP's total at each wage, from its own note: 4,600.00, 4,601.00, 4,601.00 and
  -- 5,751.00. Employee at 2000001 and 2000050 and 2500055 is 11% to the sen; the
  -- employer's share is the total less that.
  if private.hr_payroll_proposal('epf', 2000000, 30, 'citizen') <> 220000
     or private.hr_payroll_proposal('epf', 2000000, 30, 'citizen', 'employer') <> 240000 then
    fails := array_append(fails, format('RM 20,000.00 is %s / %s, expected 220000 / 240000',
      private.hr_payroll_proposal('epf', 2000000, 30, 'citizen'),
      private.hr_payroll_proposal('epf', 2000000, 30, 'citizen', 'employer')));
  end if;
  if private.hr_payroll_proposal('epf', 2000001, 30, 'citizen') <> 220000
     or private.hr_payroll_proposal('epf', 2000001, 30, 'citizen', 'employer') <> 240100 then
    fails := array_append(fails, format('RM 20,000.01 is %s / %s, expected 220000 / 240100 (total 4,601.00)',
      private.hr_payroll_proposal('epf', 2000001, 30, 'citizen'),
      private.hr_payroll_proposal('epf', 2000001, 30, 'citizen', 'employer')));
  end if;
  if private.hr_payroll_proposal('epf', 2000050, 30, 'citizen') <> 220006
     or private.hr_payroll_proposal('epf', 2000050, 30, 'citizen', 'employer') <> 240094 then
    fails := array_append(fails, format('RM 20,000.50 is %s / %s, expected 220006 / 240094 (total 4,601.00)',
      private.hr_payroll_proposal('epf', 2000050, 30, 'citizen'),
      private.hr_payroll_proposal('epf', 2000050, 30, 'citizen', 'employer')));
  end if;
  if private.hr_payroll_proposal('epf', 2500055, 30, 'citizen') <> 275006
     or private.hr_payroll_proposal('epf', 2500055, 30, 'citizen', 'employer') <> 300094 then
    fails := array_append(fails, format('RM 25,000.55 is %s / %s, expected 275006 / 300094 (total 5,751.00)',
      private.hr_payroll_proposal('epf', 2500055, 30, 'citizen'),
      private.hr_payroll_proposal('epf', 2500055, 30, 'citizen', 'employer')));
  end if;

  -- ==== 2. every wage above the last band, Part A ==================================
  -- 400 wages from RM 20,000.01 up, and four far ones, so a wage where the exact
  -- percentage happens to land on a ringgit is covered as well as one that does not.
  select count(*) into n
  from (
    select g as wage from generate_series(2000001, 2000400) as g
    union all select 3300000 union all select 5000001 union all select 12345678 union all select 100000000
  ) as s
  where private.hr_payroll_proposal('epf', s.wage, 30, 'citizen')
        + private.hr_payroll_proposal('epf', s.wage, 30, 'citizen', 'employer')
        <> (ceil(s.wage * 0.23 / 100) * 100)::bigint;
  if n <> 0 then
    fails := array_append(fails, format('%s wages above RM 20,000.00 do not add up to the rounded-up total', n));
  end if;

  -- The employee's deduction on the same wages is still exactly 11% to the sen.
  select count(*) into n
  from generate_series(2000001, 2000400) as g
  where private.hr_payroll_proposal('epf', g, 30, 'citizen') <> round(g * 0.11);
  if n <> 0 then
    fails := array_append(fails, format('%s wages above RM 20,000.00 no longer charge the employee 11%% to the sen', n));
  end if;

  -- Nothing below or at RM 20,000.00 moved: the band rows carry the Schedule's own
  -- amount and the function returns it, so a spot set of band edges answers as before.
  if private.hr_payroll_proposal('epf', 1, 30, 'citizen') <> 0
     or private.hr_payroll_proposal('epf', 1, 30, 'citizen', 'employer') <> 0
     or private.hr_payroll_proposal('epf', 300000, 30, 'citizen') <> 33000
     or private.hr_payroll_proposal('epf', 300000, 30, 'citizen', 'employer') <> 39000
     or private.hr_payroll_proposal('epf', 510000, 30, 'citizen') <> 56100
     or private.hr_payroll_proposal('epf', 510000, 30, 'citizen', 'employer') <> 61200
     or private.hr_payroll_proposal('epf', 510001, 30, 'citizen') <> 57200
     or private.hr_payroll_proposal('epf', 510001, 30, 'citizen', 'employer') <> 62400 then
    fails := array_append(fails, 'the band amounts at or below RM 20,000.00 moved');
  end if;

  -- ==== 3. Part C and Part E follow the same note ==================================
  -- Permanent resident from 60: 5.5% and 6%, so 11.5% of the wage rounded up.
  if private.hr_payroll_proposal('epf', 2000001, 61, 'permanent_resident') <> 110000
     or private.hr_payroll_proposal('epf', 2000001, 61, 'permanent_resident', 'employer') <> 120100 then
    fails := array_append(fails, format('Part C at RM 20,000.01 is %s / %s, expected 110000 / 120100',
      private.hr_payroll_proposal('epf', 2000001, 61, 'permanent_resident'),
      private.hr_payroll_proposal('epf', 2000001, 61, 'permanent_resident', 'employer')));
  end if;
  select count(*) into n
  from generate_series(2000001, 2000400) as g
  where private.hr_payroll_proposal('epf', g, 61, 'permanent_resident')
        + private.hr_payroll_proposal('epf', g, 61, 'permanent_resident', 'employer')
        <> (ceil(g * 0.115 / 100) * 100)::bigint;
  if n <> 0 then
    fails := array_append(fails, format('%s Part C wages above RM 20,000.00 do not add up to the rounded-up total', n));
  end if;

  -- A citizen from 60 has no employee share, so the employer's 4% is the whole total.
  if private.hr_payroll_proposal('epf', 2000050, 61, 'citizen') <> 0
     or private.hr_payroll_proposal('epf', 2000050, 61, 'citizen', 'employer') <> 80100 then
    fails := array_append(fails, format('Part E at RM 20,000.50 is %s / %s, expected 0 / 80100',
      private.hr_payroll_proposal('epf', 2000050, 61, 'citizen'),
      private.hr_payroll_proposal('epf', 2000050, 61, 'citizen', 'employer')));
  end if;
  select count(*) into n
  from generate_series(2000001, 2000400) as g
  where private.hr_payroll_proposal('epf', g, 61, 'citizen', 'employer')
        <> (ceil(g * 0.04 / 100) * 100)::bigint;
  if n <> 0 then
    fails := array_append(fails, format('%s Part E wages above RM 20,000.00 are not the rounded-up total', n));
  end if;

  -- ==== 4. Part F is a rate row from RM 0.00, and is left to the sen ===============
  -- The note speaks about salaries above RM 20,000.00; Part F's row starts at RM 0.00,
  -- so this function keeps it to the sen at every wage. Written down here so the
  -- boundary is a check rather than a silence: a non-citizen's two shares are 2% each.
  if private.hr_payroll_proposal('epf', 2000050, 30, 'non_citizen') <> 40001
     or private.hr_payroll_proposal('epf', 2000050, 30, 'non_citizen', 'employer') <> 40001 then
    fails := array_append(fails, format('Part F at RM 20,000.50 is %s / %s, expected 40001 / 40001',
      private.hr_payroll_proposal('epf', 2000050, 30, 'non_citizen'),
      private.hr_payroll_proposal('epf', 2000050, 30, 'non_citizen', 'employer')));
  end if;

  -- ==== 5. no other scheme moved ===================================================
  if private.hr_payroll_proposal('socso', 595000, 30, 'citizen') <> 2975
     or private.hr_payroll_proposal('socso', 595000, 30, 'citizen', 'employer') <> 10415
     or private.hr_payroll_proposal('eis', 595000, 30, 'citizen') <> 1190
     or private.hr_payroll_proposal('socso', 2500055, 30, 'citizen', 'employer') <> 10415 then
    fails := array_append(fails, 'SOCSO or EIS moved with the EPF total rounding');
  end if;

  raise exception 'PEOPLE_PAYROLL_EPF_TOTAL_ROUNDING_CHECK %', case
    when cardinality(fails) > 0 then format('FAILED (%s): %s', cardinality(fails), array_to_string(fails, '; '))
    else 'PASSED (everything rolled back)'
  end;
end $$;
