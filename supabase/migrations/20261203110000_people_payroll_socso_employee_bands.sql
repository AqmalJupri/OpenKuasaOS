-- Lekiu payroll: the employee's SOCSO share is Akta 4's invalidity figure for the
-- wage band, not 0.5% of the wage (issue #423, part 1).
--
-- The employee row was a rate, `('socso', 0.005, 2975)`
-- (20261027090000_people_payroll_writes.sql:108), and the proposal multiplies it by
-- the exact wage while the schedule prints one figure for the whole band. Swept at
-- every whole ringgit from RM1.00 to RM6,000.00 against the printed invalidity
-- column, the rate is off on 5,822 of 6,000 points, worst 25 sen, 2,950 over and
-- 2,872 under: RM300.00 gives 1.50 where the table says 1.25 and RM300.01 gives
-- 1.50 where it says 1.75, because the table steps at the band edge; RM3,133.27
-- gives 15.67 against 15.75. The ceiling agrees at 29.75, which is why the rate
-- looks right in a spot check.
--
-- Where the figures come from: PERKESO's Akta 4 contribution schedule including
-- SKBBK (NewContributionRateIncludingSKBBK.pdf), 8 pages of real text, 65 rows:
-- 64 bands and the row above the RM6,000 ceiling. Each printed row satisfies
-- employer + employee invalidity + employee SKBBK = its total and second-category
-- employer + SKBBK = its total, 0 mismatches over the 455 figures. The band edges
-- and the employer column here are the ones 20261203100000 already loads, and the
-- parse agrees with that file on all 65 rows of both categories.
-- supabase/tests/people_payroll_socso_bands_check.sql pins the figures this migration
-- stores in its last section and reads them back through the function; the employer
-- column the section above it pins is 20261203100000's.
--
-- What is deliberately not here: SKBBK, the employee's non-employment injury
-- share, which the schedule prints at RM44.65 at the ceiling and which the app
-- charges nowhere at any age. Whether a Malaysian pays it is contested (PERKESO's
-- FAQ calls it mandatory; a Cabinet decision on 8 July 2026 made it voluntary for
-- Malaysians and kept it mandatory for foreign workers), so the employee's SOCSO
-- deduction stays the invalidity share until that question is settled. The
-- invalidity column carries no such question: it is paid below 60 by everyone.
--
-- The key does not move: a band row carries amount_cents, so the proposal reads it
-- and no rate. Four citizenships by 65 bands, 260 rows, in place of 4.

-- ---- the rate rows these bands replace ------------------------------------
delete from public.hr_statutory_rules where scheme = 'socso' and payer = 'employee';

-- ---- invalidity share, below 60: 65 bands x 4 citizenships -----------------
-- The age band is the one the four rows carried: below 60, so a payslip for
-- someone of 60 or over keeps the zero the second category gives them.
insert into public.hr_statutory_rules
  (scheme, payer, citizenship, employee_from_age, employee_until_age, wage_from_cents,
   rate, max_cents, round_to_cents, note, amount_cents)
select 'socso', 'employee', s.citizenship, 0, 60, b.from_cents,
       null, null, 1, 'Akta 4 schedule, invalidity share, below 60', b.amount_cents
from (values
    (1, 10),
    (3001, 20),
    (5001, 30),
    (7001, 40),
    (10001, 60),
    (14001, 85),
    (20001, 125),
    (30001, 175),
    (40001, 225),
    (50001, 275),
    (60001, 325),
    (70001, 375),
    (80001, 425),
    (90001, 475),
    (100001, 525),
    (110001, 575),
    (120001, 625),
    (130001, 675),
    (140001, 725),
    (150001, 775),
    (160001, 825),
    (170001, 875),
    (180001, 925),
    (190001, 975),
    (200001, 1025),
    (210001, 1075),
    (220001, 1125),
    (230001, 1175),
    (240001, 1225),
    (250001, 1275),
    (260001, 1325),
    (270001, 1375),
    (280001, 1425),
    (290001, 1475),
    (300001, 1525),
    (310001, 1575),
    (320001, 1625),
    (330001, 1675),
    (340001, 1725),
    (350001, 1775),
    (360001, 1825),
    (370001, 1875),
    (380001, 1925),
    (390001, 1975),
    (400001, 2025),
    (410001, 2075),
    (420001, 2125),
    (430001, 2175),
    (440001, 2225),
    (450001, 2275),
    (460001, 2325),
    (470001, 2375),
    (480001, 2425),
    (490001, 2475),
    (500001, 2525),
    (510001, 2575),
    (520001, 2625),
    (530001, 2675),
    (540001, 2725),
    (550001, 2775),
    (560001, 2825),
    (570001, 2875),
    (580001, 2925),
    (590001, 2975),
    (600001, 2975)
  ) as b(from_cents, amount_cents)
cross join (values
    ('citizen'),
    ('permanent_resident'),
    ('non_citizen_before_1998'),
    ('non_citizen')
  ) as s(citizenship);
