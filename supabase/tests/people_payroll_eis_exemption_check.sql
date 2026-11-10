-- Lekiu payroll: the EIS exemption at 57 is one stored fact per employee, read
-- by the payslip (issue #423, part 2). Leaves nothing behind: the block always
-- ends with RAISE, so every row is rolled back. Read the message:
--   PEOPLE_PAYROLL_EIS_EXEMPTION_CHECK PASSED ...   or   ... FAILED (n): <what went wrong>
--
-- Five employees on the same basic RM3,000 in a fixed month of 2025, differing
-- only in the birthday that decides the age, so no figure depends on today:
--   aged 57, 58 and 59   EIS 600 on both sides, the 0.2% the rule table holds
--   aged 45              the same 600, well inside the bands
--   aged 60              EIS 0, the band's own ceiling
-- then the exemption ticked on all five: 57, 58 and 59 pay no EIS, the 45 year
-- old pays as before because the flag is only read from 57, and the 60 year old
-- does not move. Every employee's EPF and SOCSO figures are compared with the
-- ones the same payslip held before the tick, so the check shows the flag reaches
-- EIS alone instead of naming those figures itself: at 60 both are zero through
-- the schemes' own age rules, and an assertion written by hand would have said
-- otherwise.
do $$
declare
  org uuid := gen_random_uuid();
  owner_id uuid := gen_random_uuid();
  emp57 uuid;
  emp58 uuid;
  emp59 uuid;
  emp45 uuid;
  emp60 uuid;
  run_id uuid;
  slip uuid;
  who text;
  r jsonb;
  n bigint;
  fails text[] := '{}';
  got text;
  want text;
  mar date := date '2025-03-01';
begin
  begin
    -- ---- helpers (temporary, rolled back with the rest) ------------------
    execute $f$
      create function pg_temp.x_eis(p_slip uuid) returns text language sql as $body$
        select format('eis %s %s epf %s socso %s', p.eis_cents, p.eis_employer_cents,
          p.epf_cents, p.socso_cents)
        from public.hr_payslips p where p.id = p_slip
      $body$
    $f$;
    execute $f$
      create function pg_temp.x_rest(p_slip uuid) returns text language sql as $body$
        select format('epf %s socso %s', p.epf_cents, p.socso_cents)
        from public.hr_payslips p where p.id = p_slip
      $body$
    $f$;
    execute $f$
      create function pg_temp.x_expect(label text, got text, want text) returns text[] language sql as $body$
        select case when got is not distinct from want then '{}'::text[]
          else array[format('%s: expected %s, got %s', label, coalesce(want, 'nothing'), coalesce(got, 'nothing'))] end
      $body$
    $f$;

    -- ---- the column and who may write it ---------------------------------
    select count(*) into n from information_schema.columns c
    where c.table_schema = 'public' and c.table_name = 'hr_employee_private'
      and c.column_name = 'eis_exempt' and c.data_type = 'boolean'
      and c.is_nullable = 'NO' and c.column_default = 'false';
    if n <> 1 then
      fails := array_append(fails, 'hr_employee_private.eis_exempt is not a required boolean that defaults false');
    end if;
    if not has_column_privilege('authenticated', 'public.hr_employee_private', 'eis_exempt', 'UPDATE') then
      fails := array_append(fails, 'an owner cannot write eis_exempt, so HR has no way to set it');
    end if;
    if has_column_privilege('anon', 'public.hr_employee_private', 'eis_exempt', 'UPDATE') then
      fails := array_append(fails, 'anon may write eis_exempt');
    end if;

    -- ---- a workspace, an owner and five employees ------------------------
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_anonymous)
    values (owner_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      owner_id || '@eis-exemption-check.openkuasa-test.dev', '', now(), now(), now(), '{}'::jsonb, '{}'::jsonb, false);
    insert into public.orgs (id, name) values (org, 'EIS Exemption Check Sdn Bhd');
    insert into public.org_members (org_id, user_id, role) values (org, owner_id, 'owner');

    -- The age the payslip reads is the one reached before the month began, so
    -- these birthdays give 57, 58, 59, 45 and 60 on 28 February 2025.
    insert into public.hr_employees (org_id, employee_no, name, join_date)
    values (org, '57', 'Aged 57', date '2000-01-01') returning id into emp57;
    insert into public.hr_employees (org_id, employee_no, name, join_date)
    values (org, '58', 'Aged 58', date '2000-01-01') returning id into emp58;
    insert into public.hr_employees (org_id, employee_no, name, join_date)
    values (org, '59', 'Aged 59', date '2000-01-01') returning id into emp59;
    insert into public.hr_employees (org_id, employee_no, name, join_date)
    values (org, '45', 'Aged 45', date '2000-01-01') returning id into emp45;
    insert into public.hr_employees (org_id, employee_no, name, join_date)
    values (org, '60', 'Aged 60', date '2000-01-01') returning id into emp60;
    insert into public.hr_employee_private (employee_id, org_id, base_salary_cents, date_of_birth)
    values (emp57, org, 300000, date '1967-06-15'),
           (emp58, org, 300000, date '1966-06-15'),
           (emp59, org, 300000, date '1965-06-15'),
           (emp45, org, 300000, date '1979-06-15'),
           (emp60, org, 300000, date '1964-06-15');

    -- ---- the rule table still charges 57, so the exemption is the column --
    if private.hr_payroll_proposal('eis', 300000, 57, 'citizen') <> 600 then
      fails := array_append(fails, 'the EIS rule table no longer proposes 600 at 57, so this check proves nothing');
    end if;

    -- ---- the run ---------------------------------------------------------
    perform set_config('request.jwt.claims',
      json_build_object('sub', owner_id, 'role', 'authenticated', 'aal', 'aal1')::text, true);
    set local role authenticated;
    r := public.hr_run_payroll(org, mar);
    reset role;
    run_id := (r #>> '{run,id}')::uuid;
    if run_id is null then
      raise exception 'no payroll run was made, so nothing else was tried';
    end if;

    create temp table x_before on commit drop as
      select e.employee_no as no, p.id as slip, pg_temp.x_eis(p.id) as got, pg_temp.x_rest(p.id) as rest
      from public.hr_payslips p
      join public.hr_employees e on e.id = p.employee_id
      where p.payroll_run_id = run_id;

    select count(*) into n from x_before;
    if n <> 5 then
      fails := array_append(fails, format('the run made %s payslips, expected 5', n));
    end if;

    -- ---- unticked: the age bands decide, and 57, 58, 59 and 45 are inside -
    for who in select b.no from x_before b where b.no <> '60' order by b.no loop
      select b.got into got from x_before b where b.no = who;
      fails := fails || pg_temp.x_expect(format('aged %s, unticked', who), got,
        'eis 600 600 epf 33000 socso 1500');
    end loop;
    select b.got into got from x_before b where b.no = '60';
    if got not like 'eis 0 0 %' then
      fails := array_append(fails, format('aged 60, unticked: expected no EIS from the age band, got %s', got));
    end if;

    -- ---- ticked: EIS stops at 57, and nothing else moves -----------------
    update public.hr_employee_private set eis_exempt = true
    where employee_id in (emp57, emp58, emp59, emp45, emp60);
    for who, slip in select b.no, b.slip from x_before b order by b.no loop
      perform private.hr_payroll_refresh_payslip(slip);
      got := pg_temp.x_eis(slip);
      if who = '45' then
        fails := fails || pg_temp.x_expect('aged 45, ticked', got,
          (select b.got from x_before b where b.no = '45'));
      elsif got not like 'eis 0 0 %' then
        fails := array_append(fails, format('aged %s, ticked: expected no EIS, got %s', who, got));
      end if;
      if pg_temp.x_rest(slip) is distinct from (select b.rest from x_before b where b.no = who) then
        fails := array_append(fails, format('aged %s, ticked: EPF or SOCSO moved from %s to %s', who,
          (select b.rest from x_before b where b.no = who), pg_temp.x_rest(slip)));
      end if;
    end loop;

    -- ---- untick puts the contribution back ------------------------------
    update public.hr_employee_private set eis_exempt = false where employee_id = emp57;
    select b.slip into slip from x_before b where b.no = '57';
    perform private.hr_payroll_refresh_payslip(slip);
    fails := fails || pg_temp.x_expect('aged 57, unticked again', pg_temp.x_eis(slip),
      'eis 600 600 epf 33000 socso 1500');

    -- ---- what it all says ------------------------------------------------
    if cardinality(fails) = 0 then
      raise exception 'PEOPLE_PAYROLL_EIS_EXEMPTION_CHECK PASSED (everything rolled back)';
    else
      raise exception 'PEOPLE_PAYROLL_EIS_EXEMPTION_CHECK FAILED (%): %', cardinality(fails), array_to_string(fails, ' | ');
    end if;
  exception when others then
    if sqlerrm like 'PEOPLE_PAYROLL_EIS_EXEMPTION_CHECK PASSED%' or sqlerrm like 'PEOPLE_PAYROLL_EIS_EXEMPTION_CHECK FAILED%' then
      raise;
    end if;
    raise exception 'PEOPLE_PAYROLL_EIS_EXEMPTION_CHECK FAILED at the setup: %', sqlerrm;
  end;
end $$;
