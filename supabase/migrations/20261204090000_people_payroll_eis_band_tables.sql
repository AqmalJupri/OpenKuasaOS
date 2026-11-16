-- Lekiu payroll: EIS shares come from the Second Schedule of Act 800 bands, not as a
-- rate of wages (issue #423, part 1).
--
-- The EIS rows were one rate each (0.2% of wages, capped at RM11.90), and a rate moves
-- with every sen inside a band while the schedule prints one figure for the whole band.
-- Swept at every whole ringgit from RM1.00 to RM6,000.00, the flat rate is off on 5,641
-- of 6,000 points, 2,775 over and 2,866 under, worst 10 sen, and it is already right
-- above the ceiling because the cap holds the top band's RM11.90.
--
-- Where the figures come from, and how the load is proved. Act 800's Second Schedule
-- charges the employer and the employee the same amount, and that amount is 0.2% of the
-- band's midpoint rounded up to the next 5 sen. Two printed sources agree with the rule:
--   * the Act's own deemed-wage table (Akta_800__SIP_BM.pdf, 44 bands to RM4,000 and the
--     row above RM4,000) prints the total contribution for every one of those bands;
--   * PERKESO's Second Schedule in Employers' Circular No. 3/2024 prints 65 rows to the
--     RM6,000 ceiling, and its last eleven rows are the bands from RM5,000 to RM11.90.
-- supabase/tests/people_payroll_eis_bands_check.sql pins all 65 figures and reads them
-- back through the proposal function.
--
-- Both payers are loaded: EIS takes the same amount from each, so one set of 65 rows
-- serves the employer and one serves the employee, for the two citizenships EIS covers.
-- The row above RM6,000 repeats the ceiling band's figure, as the schedule prints it.
--
-- The key does not move: a band row carries amount_cents beside wage_from_cents, so the
-- proposal reads the amount and no rate. Four sets, two payers by two citizenships, 65
-- rows each.

-- ---- the rate rows these bands replace ------------------------------------
delete from public.hr_statutory_rules where scheme = 'eis';

-- ---- 65 bands, two payers, the two citizenships EIS covers -----------------
insert into public.hr_statutory_rules
  (scheme, payer, citizenship, employee_from_age, employee_until_age, wage_from_cents,
   rate, max_cents, round_to_cents, note, amount_cents)
select 'eis', p.payer, s.citizenship, 18, 60, b.from_cents,
       null, null, 1, 'Akta 800 Second Schedule, ages 18 to 60', b.amount_cents
from (values
    (1, 5),
    (3001, 10),
    (5001, 15),
    (7001, 20),
    (10001, 25),
    (14001, 35),
    (20001, 50),
    (30001, 70),
    (40001, 90),
    (50001, 110),
    (60001, 130),
    (70001, 150),
    (80001, 170),
    (90001, 190),
    (100001, 210),
    (110001, 230),
    (120001, 250),
    (130001, 270),
    (140001, 290),
    (150001, 310),
    (160001, 330),
    (170001, 350),
    (180001, 370),
    (190001, 390),
    (200001, 410),
    (210001, 430),
    (220001, 450),
    (230001, 470),
    (240001, 490),
    (250001, 510),
    (260001, 530),
    (270001, 550),
    (280001, 570),
    (290001, 590),
    (300001, 610),
    (310001, 630),
    (320001, 650),
    (330001, 670),
    (340001, 690),
    (350001, 710),
    (360001, 730),
    (370001, 750),
    (380001, 770),
    (390001, 790),
    (400001, 810),
    (410001, 830),
    (420001, 850),
    (430001, 870),
    (440001, 890),
    (450001, 910),
    (460001, 930),
    (470001, 950),
    (480001, 970),
    (490001, 990),
    (500001, 1010),
    (510001, 1030),
    (520001, 1050),
    (530001, 1070),
    (540001, 1090),
    (550001, 1110),
    (560001, 1130),
    (570001, 1150),
    (580001, 1170),
    (590001, 1190),
    (600001, 1190)
  ) as b(from_cents, amount_cents)
cross join (values ('employee'), ('employer')) as p(payer)
cross join (values ('citizen'), ('permanent_resident')) as s(citizenship);

-- ---- how many rows the load should leave ---------------------------------
-- 260 band rows replace 4 rate rows. The check file pins the count it reads.
do $$
declare n bigint;
begin
  select count(*) into n from public.hr_statutory_rules where scheme = 'eis';
  if n <> 260 then
    raise exception 'the EIS rows are %s, expected 260', n;
  end if;
end $$;
