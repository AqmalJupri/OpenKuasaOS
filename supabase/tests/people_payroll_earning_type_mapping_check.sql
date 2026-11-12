-- Lekiu payroll: what an earning type counts towards is one table, and the wage
-- bases follow it (asked for on #422). Leaves nothing behind: the block always
-- ends with RAISE, so every row is rolled back, and so are the helper functions
-- it makes for itself in the session's temporary schema. Read the message:
--   PEOPLE_PAYROLL_EARNING_TYPE_MAPPING_CHECK PASSED ...   or   ... FAILED (n): <what went wrong>
--
-- It reads one payslip to the cent on one employee with a basic salary and no
-- overtime, in a fixed month of 2025, so no figure depends on today:
--   basic RM3,000 and a bonus RM2,000   EPF wages include the bonus, SOCSO and EIS wages do not
--   the bonus row says in_socso          the same payslip's SOCSO and EIS wages include it
--   the bonus row says in_epf false      its EPF wages lose it, with the line untouched
--   a type the table does not hold       refused at the column, not only by the save function
--
-- EIS is read from the rule table rather than written here, because the banded tables
-- on #423 move the printed figure for a wage (0.2% of RM3,000 is 600, and the
-- schedule's band prints 590). A literal would tie this check to whichever of the two
-- landed first, and EIS is not what this file asserts: the payslip's own answer only
-- has to equal the rule's, and people_payroll_eis_bands_check pins the figures.
do $$
declare
  org uuid := gen_random_uuid();
  owner_id uuid := gen_random_uuid();
  emp uuid;
  run_id uuid;
  slip uuid;
  mar date := date '2025-03-01';
  r jsonb;
  n bigint;
  who uuid := owner_id;
  fails text[] := '{}';
  want text;
  eis_basic bigint;
  eis_bonus bigint;
begin
  begin
    -- ---- helpers (temporary, rolled back with the rest) ------------------
    execute $f$
      create function pg_temp.et_try(who uuid, q text) returns jsonb language plpgsql as $body$
      declare r jsonb; msg text;
      begin
        perform set_config('request.jwt.claims',
          json_build_object('sub', who, 'role', 'authenticated', 'aal', 'aal1')::text, true);
        set local role authenticated;
        begin
          execute q into r;
        exception when others then
          msg := sqlerrm;
          reset role;
          return jsonb_build_object('refused', msg);
        end;
        reset role;
        return coalesce(r, 'null'::jsonb);
      end $body$
    $f$;
    execute $f$
      create function pg_temp.et_slip(p_slip uuid) returns text language sql as $body$
        select format('gross %s epf %s socso %s eis %s net %s',
          p.gross_cents, p.epf_cents, p.socso_cents, p.eis_cents, p.net_cents)
        from public.hr_payslips p where p.id = p_slip
      $body$
    $f$;
    execute $f$
      create function pg_temp.et_expect(label text, got text, want text) returns text[] language sql as $body$
        select case when got is not distinct from want then '{}'::text[]
          else array[format('%s: expected %s, got %s', label, coalesce(want, 'nothing'), coalesce(got, 'nothing'))] end
      $body$
    $f$;

    -- ---- the table -------------------------------------------------------
    select count(*) into n from public.hr_earning_type_wages w
    where (w.earning_type, w.in_epf, w.in_socso) in (
      ('ordinary', true, true), ('bonus', true, false), ('travel_allowance', false, false),
      ('service_charge', false, true), ('gratuity', false, false));
    if n <> 5 then
      fails := array_append(fails, format('the five rows the statutes name are not all there: %s of 5', n));
    end if;
    select count(*) into n from public.hr_earning_type_wages;
    if n <> 5 then
      fails := array_append(fails, format('the mapping table holds %s rows, not the five the app offers', n));
    end if;

    -- ---- a workspace, an owner and one employee --------------------------
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_anonymous)
    values (owner_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      owner_id || '@earning-mapping-check.openkuasa-test.dev', '', now(), now(), now(), '{}'::jsonb, '{}'::jsonb, false);
    insert into public.orgs (id, name) values (org, 'Earning Mapping Check Sdn Bhd');
    insert into public.org_members (org_id, user_id, role) values (org, owner_id, 'owner');
    insert into public.hr_employees (org_id, employee_no, name, join_date)
    values (org, 'A', 'Line A', date '2020-01-01') returning id into emp;
    insert into public.hr_employee_private (employee_id, org_id, base_salary_cents, date_of_birth)
    values (emp, org, 300000, date '1990-01-15');

    -- ---- the run, and one bonus ------------------------------------------
    r := pg_temp.et_try(owner_id, format('select public.hr_run_payroll(%L, %L)', org, mar));
    if r ? 'refused' then
      fails := array_append(fails, format('the run was refused: %s', r ->> 'refused'));
    else
      run_id := (r #>> '{run,id}')::uuid;
    end if;
    select p.id into slip from public.hr_payslips p where p.payroll_run_id = run_id;
    if slip is null then
      raise exception 'no payslip was made, so nothing else was tried';
    end if;
    r := pg_temp.et_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Bonus'', 200000, ''bonus'')', slip));
    if r ? 'refused' then fails := array_append(fails, format('a bonus was refused: %s', r ->> 'refused')); end if;
    -- The rule table's own figure for each EIS wage base: RM3,000 alone, then with the bonus.
    eis_basic := private.hr_payroll_proposal('eis', 300000,
      private.hr_payroll_age_on(emp, (mar - interval '1 month')::date), 'citizen');
    eis_bonus := private.hr_payroll_proposal('eis', 500000,
      private.hr_payroll_age_on(emp, (mar - interval '1 month')::date), 'citizen');
    fails := fails || pg_temp.et_expect('basic RM3,000 and a bonus RM2,000', pg_temp.et_slip(slip),
      format('gross 500000 epf 55000 socso 1500 eis %s net %s', eis_basic, 500000 - 55000 - 1500 - eis_basic));

    -- ---- one row says a bonus is SOCSO and EIS wages too ------------------
    update public.hr_earning_type_wages set in_socso = true where earning_type = 'bonus';
    perform private.hr_payroll_refresh_payslip(slip);
    fails := fails || pg_temp.et_expect('the bonus row says in_socso: the same payslip, one row moved', pg_temp.et_slip(slip),
      format('gross 500000 epf 55000 socso 2500 eis %s net %s', eis_bonus, 500000 - 55000 - 2500 - eis_bonus));

    -- ---- and one says it is not EPF wages --------------------------------
    update public.hr_earning_type_wages set in_epf = false where earning_type = 'bonus';
    perform private.hr_payroll_refresh_payslip(slip);
    fails := fails || pg_temp.et_expect('the bonus row says in_epf false: the line is untouched', pg_temp.et_slip(slip),
      format('gross 500000 epf 33000 socso 2500 eis %s net %s', eis_bonus, 500000 - 33000 - 2500 - eis_bonus));
    update public.hr_earning_type_wages set in_epf = true, in_socso = false where earning_type = 'bonus';

    -- ---- a type the table does not hold cannot be stored -----------------
    begin
      insert into public.hr_payslip_lines (org_id, payslip_id, kind, source, earning_type, label, amount_cents)
      values (org, slip, 'earning', 'hr', 'commission', 'Commission', 1000);
      fails := array_append(fails, 'a line typed commission was stored, so the column does not point at the table');
    exception when foreign_key_violation then null;
    end;

    -- ---- what it all says ------------------------------------------------
    if cardinality(fails) = 0 then
      raise exception 'PEOPLE_PAYROLL_EARNING_TYPE_MAPPING_CHECK PASSED (everything rolled back)';
    else
      raise exception 'PEOPLE_PAYROLL_EARNING_TYPE_MAPPING_CHECK FAILED (%): %', cardinality(fails), array_to_string(fails, ' | ');
    end if;
  exception when others then
    if sqlerrm like 'PEOPLE_PAYROLL_EARNING_TYPE_MAPPING_CHECK PASSED%' or sqlerrm like 'PEOPLE_PAYROLL_EARNING_TYPE_MAPPING_CHECK FAILED%' then
      raise;
    end if;
    raise exception 'PEOPLE_PAYROLL_EARNING_TYPE_MAPPING_CHECK FAILED at the setup: %', sqlerrm;
  end;
end $$;
