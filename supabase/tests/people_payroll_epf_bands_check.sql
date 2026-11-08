-- Lekiu EPF band check: the EPF figures come from KWSP's Third Schedule, and are
-- the Schedule's own amounts rather than a rate of wages (#423, part 1).
-- Read-only: every statement below is a select, and the block ends with RAISE, so
-- even if it grew a write nothing would survive. Read the message:
--   PEOPLE_PAYROLL_EPF_BANDS_CHECK PASSED ...   or   ... FAILED (n): <what went wrong>
--
-- How the figures are proved. Not against the rate they replace, because that is
-- the thing under test. KWSP prints one amount for a whole wage range, set at the
-- range's top and rounded up to the next ringgit, so every one of the 4,411 band
-- rows has to equal ceil(rate x band top) where the rate is the part's own:
--   Part A (below 60)      employee 11%,            employer 13% to RM 5,000.00, 12% above it
--   Part C (60 to 74, PR)  employee 5.5%,           employer 6.5% to RM 5,000.00, 6% above it
--   Part E (60 to 74, citizen)                      employer 4%
-- and the first band, the first RM 10.00, pays NIL. The employer's step at RM
-- 5,000.00 is the reason the table prints a figure per range: 13% of 5,000.00 and
-- 12% of 5,000.01 fall on either side of one band edge.
--
-- The three worked examples KWSP publishes on its mandatory contribution page are
-- checked against the proposal function's own answer, not against the rows:
-- RM 3,250.00 is Part A 359.00 / 424.00, Part C 180.00 / 212.00, Part E 0.00 / 131.00.
--
-- Above RM 20,000.00 the Schedule prints no bands, and its note 2 says the shares
-- may then be an exact percentage while "the total contribution which includes
-- cents shall be rounded to the next ringgit". So the employee's deduction is the
-- part's own rate on the wage to the sen, the employer's share takes the odd sen,
-- and the two of them always add up to a whole ringgit.
do $$
declare
  fails text[] := '{}';
  n bigint; n2 bigint; n3 bigint;
  t text;
  r record;
begin
  -- ==== 1. the load ================================================================
  -- 4,411 band amounts in 11 sets, 11 rows above RM 20,000.00 (one per set) and
  -- Part F's two rate rows for a non-citizen.
  select count(*), count(*) filter (where amount_cents is not null),
         count(*) filter (where rate is not null)
    into n, n2, n3
  from public.hr_statutory_rules where scheme = 'epf';
  if n <> 4424 or n2 <> 4411 or n3 <> 13 then
    fails := array_append(fails, format('the EPF rows are %s, %s of them bands and %s rates, expected 4424, 4411 and 13', n, n2, n3));
  end if;

  -- A band carries an amount and no rate; a rate row carries a rate and no amount.
  select count(*) into n from public.hr_statutory_rules
  where scheme = 'epf' and ((amount_cents is null) = (rate is null));
  if n <> 0 then fails := array_append(fails, format('%s EPF rows carry both an amount and a rate, or neither', n)); end if;

  -- The key still names one row: the bands did not collide with the rate rows.
  select count(*) into n from (
    select 1 from public.hr_statutory_rules
    group by scheme, payer, citizenship, employee_from_age, wage_from_cents having count(*) > 1) x;
  if n <> 0 then fails := array_append(fails, format('%s statutory rules share a scheme, payer, category and wage start', n)); end if;

  select is_nullable into t from information_schema.columns
  where table_schema = 'public' and table_name = 'hr_statutory_rules' and column_name = 'rate';
  if t is distinct from 'YES' then
    fails := array_append(fails, format('rate is still %s: a band row would have to invent one', coalesce(t, 'missing')));
  end if;

  -- The combined rate lives on the eleven rows above RM 20,000.00 and nowhere else:
  -- a band row is one payer's figure and has no total to round.
  select count(*) into n from information_schema.columns
  where table_schema = 'public' and table_name = 'hr_statutory_rules' and column_name = 'total_rate';
  if n <> 1 then
    fails := array_append(fails, 'hr_statutory_rules has no total_rate, so the total above RM 20,000.00 is not rounded to the ringgit');
  else
    select count(*) into n from public.hr_statutory_rules
    where scheme = 'epf' and total_rate is not null;
    select count(*) into n2 from public.hr_statutory_rules
    where scheme = 'epf' and total_rate is not null and wage_from_cents <> 2000001;
    if n <> 11 or n2 <> 0 then
      fails := array_append(fails, format('%s EPF rows carry a combined rate and %s of them are below RM 20,000.01, expected 11 and 0', n, n2));
    end if;
  end if;

  -- ==== 2. the shape of a set ======================================================
  -- Each of the eleven sets is 401 bands: the first covers RM 0.01 to RM 10.00, the
  -- next two steps are RM 10.00 apart, then 249 RM 20.00 steps reach RM 5,000.01 and
  -- 149 RM 100.00 steps reach the last band at RM 19,900.01.
  select count(*) into n from (
    select payer, citizenship, employee_from_age, employee_until_age,
           count(*) as bands,
           count(*) filter (where gap = 1000) as tens,
           count(*) filter (where gap = 2000) as twenties,
           count(*) filter (where gap = 10000) as hundreds,
           min(wage_from_cents) as lo, max(wage_from_cents) as hi,
           count(*) filter (where gap not in (1000, 2000, 10000)) as odd
    from (
      select s.*, s.wage_from_cents - lag(s.wage_from_cents) over (
               partition by s.payer, s.citizenship, s.employee_from_age, s.employee_until_age
               order by s.wage_from_cents) as gap
      from public.hr_statutory_rules s
      where s.scheme = 'epf' and s.amount_cents is not null) b
    group by payer, citizenship, employee_from_age, employee_until_age) x
  where bands <> 401 or tens <> 2 or twenties <> 249 or hundreds <> 149
     or lo <> 1 or hi <> 1990001 or odd <> 0;
  if n <> 0 then
    fails := array_append(fails, format('%s EPF banded sets are not 401 contiguous bands from RM 0.01 to RM 20,000.00', n));
  end if;

  select count(*) into n from (
    select distinct payer, citizenship, employee_from_age, employee_until_age
    from public.hr_statutory_rules where scheme = 'epf' and amount_cents is not null) x;
  if n <> 11 then fails := array_append(fails, format('%s EPF banded sets, expected 11', n)); end if;

  -- ==== 3. every band is the Schedule's own figure =================================
  -- ceil(rate x the band's top) to the next ringgit, and NIL in the first band.
  select count(*) into n from (
    select s.amount_cents,
           case when s.wage_from_cents = 1 then 0::bigint
                else ceil(s.rate_pct * (s.next_from - 1) / 10000.0)::bigint * 100 end as want
    from (
      select b.*,
             lead(b.wage_from_cents) over (
               partition by b.payer, b.citizenship, b.employee_from_age, b.employee_until_age
               order by b.wage_from_cents) as next_from,
             case
               when b.payer = 'employee' and b.employee_until_age = 60 then 11::numeric
               when b.payer = 'employer' and b.employee_until_age = 60
                 then (case when b.wage_from_cents > 498001 then 12 else 13 end)::numeric
               when b.payer = 'employee' and b.employee_until_age = 75 then 5.5::numeric
               when b.payer = 'employer' and b.employee_until_age = 75 and b.citizenship = 'citizen' then 4::numeric
               when b.payer = 'employer' and b.employee_until_age = 75
                 then (case when b.wage_from_cents > 498001 then 6 else 6.5 end)::numeric
             end as rate_pct
      from public.hr_statutory_rules b
      where b.scheme = 'epf' and b.amount_cents is not null) s
    where s.next_from is not null and s.amount_cents <> case when s.wage_from_cents = 1 then 0::bigint
          else ceil(s.rate_pct * (s.next_from - 1) / 10000.0)::bigint * 100 end) x;
  if n <> 0 then
    fails := array_append(fails, format('%s EPF band rows are not the rate on their band top rounded up to the ringgit', n));
  end if;

  -- ==== 4. KWSP's own worked examples ==============================================
  -- https://www.kwsp.gov.my/en/employer/contributions (RM 3,250.00, the page's example)
  if format('%s %s %s', private.hr_payroll_proposal('epf', 325000, 30, 'citizen'),
            private.hr_payroll_proposal('epf', 325000, 30, 'citizen', 'employer'),
            private.hr_payroll_proposal('epf', 325000, 30, 'citizen')
              + private.hr_payroll_proposal('epf', 325000, 30, 'citizen', 'employer')) <> '35900 42400 78300' then
    fails := array_append(fails, format('Part A on RM 3,250.00 is not 359.00 / 424.00 / 783.00: %s %s %s',
      private.hr_payroll_proposal('epf', 325000, 30, 'citizen'),
      private.hr_payroll_proposal('epf', 325000, 30, 'citizen', 'employer'),
      private.hr_payroll_proposal('epf', 325000, 30, 'citizen')
        + private.hr_payroll_proposal('epf', 325000, 30, 'citizen', 'employer')));
  end if;
  if format('%s %s %s', private.hr_payroll_proposal('epf', 325000, 65, 'permanent_resident'),
            private.hr_payroll_proposal('epf', 325000, 65, 'permanent_resident', 'employer'),
            private.hr_payroll_proposal('epf', 325000, 65, 'permanent_resident')
              + private.hr_payroll_proposal('epf', 325000, 65, 'permanent_resident', 'employer')) <> '18000 21200 39200' then
    fails := array_append(fails, 'Part C on RM 3,250.00 is not 180.00 / 212.00 / 392.00');
  end if;
  if format('%s %s %s', private.hr_payroll_proposal('epf', 325000, 65, 'citizen'),
            private.hr_payroll_proposal('epf', 325000, 65, 'citizen', 'employer'),
            private.hr_payroll_proposal('epf', 325000, 65, 'citizen')
              + private.hr_payroll_proposal('epf', 325000, 65, 'citizen', 'employer')) <> '0 13100 13100' then
    fails := array_append(fails, 'Part E on RM 3,250.00 is not nothing / 131.00 / 131.00');
  end if;

  -- ==== 5. the band edges ==========================================================
  -- Each range pays one figure, so the wage moves inside a range and the figure does
  -- not, and the figure steps at the edge.
  for t, n, n2 in
    select * from (values
      ('1000', 0::bigint, 0::bigint),          -- RM 10.00: the first band is NIL
      ('1001', 300, 300),                      -- RM 10.01
      ('302000', 33300, 39300),                -- RM 3,020.00, the top of an RM 20 band
      ('302001', 33500, 39600),                -- RM 3,020.01, the next band's figure
      ('500000', 55000, 65000),                -- RM 5,000.00: 11% and 13% at their band tops
      ('500001', 56100, 61200),                -- RM 5,000.01: 11% and 12% at their band tops
      ('2000000', 220000, 240000)              -- RM 20,000.00, the last band
    ) as c(w, employee, employer)
  loop
    if private.hr_payroll_proposal('epf', t::bigint, 30, 'citizen') <> n
       or private.hr_payroll_proposal('epf', t::bigint, 30, 'citizen', 'employer') <> n2 then
      fails := array_append(fails, format('EPF on %s cents is %s / %s, expected %s / %s', t,
        private.hr_payroll_proposal('epf', t::bigint, 30, 'citizen'),
        private.hr_payroll_proposal('epf', t::bigint, 30, 'citizen', 'employer'), n, n2));
    end if;
  end loop;

  -- ==== 6. above RM 20,000.00 the shares are percentages and the total rounds up ====
  -- The employee's deduction is exactly the part's own rate to the sen, the employer's
  -- share takes the odd sen, and the two add up to ceil(combined rate x the wage) to
  -- the next ringgit. The old answer rounded each share to the sen and left the total
  -- below the Schedule's: RM 20,000.01 read 4,600.00 against 4,601.00, and further up
  -- it was 77 to 88 sen short.
  for r in
    select * from (values
      (2000001::bigint,   30, 'citizen'::text,            220000::bigint,   240100::bigint,   0.23::numeric),  -- RM 20,000.01 -> 4,601.00
      (2000030::bigint,   30, 'citizen'::text,            220003::bigint,   240097::bigint,   0.23::numeric),  -- RM 20,000.30
      (2000050::bigint,   30, 'citizen'::text,            220006::bigint,   240094::bigint,   0.23::numeric),  -- RM 20,000.50
      (2500055::bigint,   30, 'citizen'::text,            275006::bigint,   300094::bigint,   0.23::numeric),  -- RM 25,000.55 -> 5,751.00
      (100000000::bigint, 30, 'citizen'::text,            11000000::bigint, 12000000::bigint, 0.23::numeric),  -- RM 1,000,000.00, already a ringgit
      (3000000::bigint,   65, 'permanent_resident'::text, 165000::bigint,   180000::bigint,   0.115::numeric), -- Part C, RM 30,000.00
      (3000055::bigint,   65, 'permanent_resident'::text, 165003::bigint,   180097::bigint,   0.115::numeric), -- Part C, RM 30,000.55
      (2200000::bigint,   65, 'citizen'::text,            0::bigint,        88000::bigint,    0.04::numeric),   -- Part E, RM 22,000.00
      (2200030::bigint,   65, 'citizen'::text,            0::bigint,        88100::bigint,    0.04::numeric)    -- Part E, RM 22,000.30
    ) as c(wage, age, who, employee, employer, combined)
  loop
    if private.hr_payroll_proposal('epf', r.wage, r.age, r.who) <> r.employee
       or private.hr_payroll_proposal('epf', r.wage, r.age, r.who, 'employer') <> r.employer
       or r.employee + r.employer <> ceil(r.wage * r.combined / 100) * 100 then
      fails := array_append(fails, format('EPF above RM 20,000.00 on %s cents at age %s is %s / %s rather than %s / %s, and the total should be %s',
        r.wage, r.age, private.hr_payroll_proposal('epf', r.wage, r.age, r.who),
        private.hr_payroll_proposal('epf', r.wage, r.age, r.who, 'employer'), r.employee, r.employer,
        ceil(r.wage * r.combined / 100) * 100));
    end if;
  end loop;

  -- A sweep of every sen from RM 20,000.01 to RM 20,010.01 in all three parts: the
  -- total is always a whole ringgit, the employee's share is the rate itself, and
  -- nothing is left over.
  select count(*) into n from generate_series(2000001::bigint, 2001001, 1) w
  where (private.hr_payroll_proposal('epf', w, 30, 'citizen')
       + private.hr_payroll_proposal('epf', w, 30, 'citizen', 'employer')) <> ceil(w * 0.23 / 100) * 100
     or private.hr_payroll_proposal('epf', w, 30, 'citizen') <> round(w * 0.11)
     or private.hr_payroll_proposal('epf', w, 65, 'permanent_resident')
       + private.hr_payroll_proposal('epf', w, 65, 'permanent_resident', 'employer') <> ceil(w * 0.115 / 100) * 100
     or private.hr_payroll_proposal('epf', w, 65, 'permanent_resident') <> round(w * 0.055)
     or private.hr_payroll_proposal('epf', w, 65, 'citizen', 'employer') <> ceil(w * 0.04 / 100) * 100
     or private.hr_payroll_proposal('epf', w, 65, 'citizen') <> 0;
  if n <> 0 then
    fails := array_append(fails, format('%s of 1,001 wages above RM 20,000.00 do not add up to a whole ringgit', n));
  end if;

  -- ==== 7. the categories this migration keeps =====================================
  -- A citizen pays no employee share from 60 (Part E is the employer's 4%), the
  -- second category steps down at RM 5,000.00 as the first does, and a non-citizen
  -- pays Part F's 2% at any age up to 75.
  if private.hr_payroll_proposal('epf', 500000, 60, 'citizen') <> 0
     or private.hr_payroll_proposal('epf', 500000, 60, 'citizen', 'employer') <> 20000
     or private.hr_payroll_proposal('epf', 500000, 61, 'permanent_resident') <> 27500
     or private.hr_payroll_proposal('epf', 500000, 61, 'permanent_resident', 'employer') <> 32500
     or private.hr_payroll_proposal('epf', 500001, 61, 'permanent_resident', 'employer') <> 30600
     or private.hr_payroll_proposal('epf', 500000, 30, 'non_citizen') <> 10000
     or private.hr_payroll_proposal('epf', 500000, 30, 'non_citizen', 'employer') <> 10000
     or private.hr_payroll_proposal('epf', 500000, 75, 'non_citizen') <> 0 then
    fails := array_append(fails, 'the EPF category rows do not follow the part the employee falls in');
  end if;

  -- ==== 8. the employee SOCSO share and EIS are untouched =========================
  -- The EPF migration rewrites every EPF row and no other scheme's, and the SOCSO
  -- migration that follows it rewrites the employer share only, so these figures have
  -- to be exactly what they were: rates on the wage, held at the tables' ceilings. The
  -- employer share is a band amount now and is pinned by people_payroll_socso_bands_check.
  if private.hr_payroll_proposal('socso', 325000, 30, 'citizen') <> 1625
     or private.hr_payroll_proposal('socso', 325000, 30, 'citizen', 'employer') <> 5685
     or private.hr_payroll_proposal('eis', 325000, 30, 'citizen') <> 650
     or private.hr_payroll_proposal('socso', 595000, 30, 'citizen') <> 2975
     or private.hr_payroll_proposal('socso', 595000, 30, 'citizen', 'employer') <> 10415
     or private.hr_payroll_proposal('eis', 595000, 30, 'citizen') <> 1190
     or private.hr_payroll_proposal('socso', 595000, 61, 'citizen', 'employer') <> 7440 then
    fails := array_append(fails, 'SOCSO or EIS moved with the EPF bands');
  end if;

  raise exception 'PEOPLE_PAYROLL_EPF_BANDS_CHECK %', case
    when cardinality(fails) > 0 then format('FAILED (%s): %s', cardinality(fails), array_to_string(fails, '; '))
    else 'PASSED (everything rolled back)'
  end;
end $$;
