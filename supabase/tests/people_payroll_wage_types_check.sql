-- Lekiu payroll: what kind of earning a line is decides the EPF wage base and
-- the SOCSO and EIS wage base (issue #402). Leaves nothing behind: the block
-- always ends with RAISE, so every row is rolled back, and so are the helper
-- functions it makes for itself in the session's temporary schema. Read the
-- message:
--   PEOPLE_PAYROLL_WAGE_TYPES_CHECK PASSED ...   or   ... FAILED (n): <what went wrong>
--
-- It reads one payslip to the cent after each change, on one employee with a
-- basic salary and no overtime, in a fixed month of 2025, so no figure depends
-- on today:
--   basic RM3,000                     EPF 11% of 300000, SOCSO 0.5% of 300000, EIS 0.2% of 300000
--   + a bonus RM2,000                 EPF wages include it; SOCSO and EIS wages do not
--   + ordinary pay RM1,000            all three
--   + a travel allowance RM500        none
--   + a service charge RM400          SOCSO and EIS, not EPF
--   + a gratuity RM600                none
--   the bonus is changed to a travel allowance   every figure moves back down
--
-- The rates are the ones hr_statutory_rules holds (a rate and a cap); the
-- banded tables on #402 are a separate change and move only the money.
do $$
declare
  org uuid := gen_random_uuid();
  owner_id uuid := gen_random_uuid();
  emp uuid;
  run_id uuid;
  slip uuid;
  bonus uuid;
  line2 uuid;
  mar date := date '2025-03-01';
  r jsonb;
  n bigint;
  who uuid := owner_id;
  fails text[] := '{}';
  want text;
begin
  begin
    -- ---- helpers (temporary, rolled back with the rest) ------------------
    execute $f$
      create function pg_temp.wt_try(who uuid, q text) returns jsonb language plpgsql as $body$
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
      create function pg_temp.wt_slip(p_slip uuid) returns text language sql as $body$
        select format('gross %s epf %s socso %s eis %s net %s',
          p.gross_cents, p.epf_cents, p.socso_cents, p.eis_cents, p.net_cents)
        from public.hr_payslips p where p.id = p_slip
      $body$
    $f$;
    execute $f$
      create function pg_temp.wt_expect(label text, got text, want text) returns text[] language sql as $body$
        select case when got is not distinct from want then '{}'::text[]
          else array[format('%s: expected %s, got %s', label, coalesce(want, 'nothing'), coalesce(got, 'nothing'))] end
      $body$
    $f$;
    execute $f$
      create function pg_temp.wt_types(p_slip uuid) returns text language sql as $body$
        select coalesce(string_agg(format('%s %s', l.label, l.earning_type), '; ' order by l.created_at, l.label), 'none')
        from public.hr_payslip_lines l where l.payslip_id = p_slip
      $body$
    $f$;

    -- ---- the column ------------------------------------------------------
    select count(*) into n from information_schema.columns c
    where c.table_schema = 'public' and c.table_name = 'hr_payslip_lines' and c.column_name = 'earning_type'
      and c.is_nullable = 'NO' and c.column_default is not null;
    if n <> 1 then
      fails := array_append(fails, 'hr_payslip_lines.earning_type is not there, required, with a default');
    end if;

    -- ---- a workspace, an owner and one employee --------------------------
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_anonymous)
    values (owner_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      owner_id || '@wage-types-check.openkuasa-test.dev', '', now(), now(), now(), '{}'::jsonb, '{}'::jsonb, false);
    insert into public.orgs (id, name) values (org, 'Wage Types Check Sdn Bhd');
    insert into public.org_members (org_id, user_id, role) values (org, owner_id, 'owner');
    insert into public.hr_employees (org_id, employee_no, name, join_date)
    values (org, 'A', 'Line A', date '2020-01-01') returning id into emp;
    insert into public.hr_employee_private (employee_id, org_id, base_salary_cents, date_of_birth)
    values (emp, org, 300000, date '1990-01-15');

    -- ---- the run ---------------------------------------------------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_run_payroll(%L, %L)', org, mar));
    if r ? 'refused' then
      fails := array_append(fails, format('the first run was refused: %s', r ->> 'refused'));
    else
      run_id := (r #>> '{run,id}')::uuid;
    end if;
    select p.id into slip from public.hr_payslips p where p.payroll_run_id = run_id;
    if slip is null then
      raise exception 'no payslip was made, so nothing else was tried';
    end if;
    fails := fails || pg_temp.wt_expect('basic RM3,000', pg_temp.wt_slip(slip),
      'gross 300000 epf 33000 socso 1500 eis 600 net 264900');

    -- ---- a bonus counts for EPF only -------------------------------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Bonus'', 200000, ''bonus'')', slip));
    bonus := (r #>> '{line,id}')::uuid;
    if r ? 'refused' then fails := array_append(fails, format('a bonus was refused: %s', r ->> 'refused')); end if;
    fails := fails || pg_temp.wt_expect('+ a bonus RM2,000', pg_temp.wt_slip(slip),
      'gross 500000 epf 55000 socso 1500 eis 600 net 442900');

    -- ---- ordinary pay counts for all three -------------------------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Allowance'', 100000)', slip));
    if r ? 'refused' then fails := array_append(fails, format('an ordinary line was refused: %s', r ->> 'refused')); end if;
    fails := fails || pg_temp.wt_expect('+ ordinary pay RM1,000', pg_temp.wt_slip(slip),
      'gross 600000 epf 66000 socso 2000 eis 800 net 531200');

    -- ---- a travel allowance counts for none ------------------------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Petrol'', 50000, ''travel_allowance'')', slip));
    if r ? 'refused' then fails := array_append(fails, format('a travel allowance was refused: %s', r ->> 'refused')); end if;
    fails := fails || pg_temp.wt_expect('+ a travel allowance RM500', pg_temp.wt_slip(slip),
      'gross 650000 epf 66000 socso 2250 eis 900 net 580850');

    -- ---- a service charge is not EPF wages -------------------------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Service charge'', 40000, ''service_charge'')', slip));
    if r ? 'refused' then fails := array_append(fails, format('a service charge was refused: %s', r ->> 'refused')); end if;
    fails := fails || pg_temp.wt_expect('+ a service charge RM400', pg_temp.wt_slip(slip),
      'gross 690000 epf 66000 socso 2450 eis 980 net 620570');

    -- ---- a gratuity counts for none --------------------------------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Gratuity'', 60000, ''gratuity'')', slip));
    if r ? 'refused' then fails := array_append(fails, format('a gratuity was refused: %s', r ->> 'refused')); end if;
    fails := fails || pg_temp.wt_expect('+ a gratuity RM600', pg_temp.wt_slip(slip),
      'gross 750000 epf 66000 socso 2450 eis 980 net 680570');

    -- ---- changing what a line is moves every figure back down ------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, %L, ''earning'', ''Bonus'', 200000, ''travel_allowance'')', slip, bonus));
    if r ? 'refused' then fails := array_append(fails, format('the bonus could not be changed: %s', r ->> 'refused')); end if;
    fails := fails || pg_temp.wt_expect('the bonus becomes a travel allowance', pg_temp.wt_slip(slip),
      'gross 750000 epf 44000 socso 2200 eis 880 net 702920');

    -- ---- refusals --------------------------------------------------------
    want := 'PAYROLL_BAD_INPUT';
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Overtime'', 1000, ''overtime'')', slip));
    if r ->> 'refused' is distinct from want then
      fails := array_append(fails, format('a line typed as overtime: expected %s, got %s', want, coalesce(r ->> 'refused', r::text)));
    end if;
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''earning'', ''Commission'', 1000, ''commission'')', slip));
    if r ->> 'refused' is distinct from want then
      fails := array_append(fails, format('a type that is not on the list: expected %s, got %s', want, coalesce(r ->> 'refused', r::text)));
    end if;

    -- ---- a deduction carries no type -------------------------------------
    r := pg_temp.wt_try(owner_id, format('select public.hr_save_payslip_line(%L, null, ''deduction'', ''Advance'', 20000, ''bonus'')', slip));
    line2 := (r #>> '{line,id}')::uuid;
    if r ? 'refused' then
      fails := array_append(fails, format('a deduction with a type was refused: %s', r ->> 'refused'));
    elsif r #>> '{line,earning_type}' is distinct from 'ordinary' then
      fails := array_append(fails, format('a deduction kept the type it was sent: %s', r #>> '{line,earning_type}'));
    end if;
    select count(*) into n from public.hr_payslip_lines l where l.id = line2 and l.earning_type = 'ordinary';
    if n <> 1 then fails := array_append(fails, 'the deduction line was not stored as ordinary'); end if;

    -- ---- the lines say what they are -------------------------------------
    select pg_temp.wt_types(slip) into want;
    if want is distinct from 'Line A ordinary; Bonus travel_allowance; Allowance ordinary; Petrol travel_allowance; Service charge service_charge; Gratuity gratuity; Advance ordinary' then
      fails := array_append(fails, format('the lines read: %s', want));
    end if;

    -- ---- what it all says ------------------------------------------------
    if cardinality(fails) = 0 then
      raise exception 'PEOPLE_PAYROLL_WAGE_TYPES_CHECK PASSED (everything rolled back)';
    else
      raise exception 'PEOPLE_PAYROLL_WAGE_TYPES_CHECK FAILED (%): %', cardinality(fails), array_to_string(fails, ' | ');
    end if;
  exception when others then
    if sqlerrm like 'PEOPLE_PAYROLL_WAGE_TYPES_CHECK PASSED%' or sqlerrm like 'PEOPLE_PAYROLL_WAGE_TYPES_CHECK FAILED%' then
      raise;
    end if;
    raise exception 'PEOPLE_PAYROLL_WAGE_TYPES_CHECK FAILED at the setup: %', sqlerrm;
  end;
end $$;
