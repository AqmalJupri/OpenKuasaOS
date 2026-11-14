-- Bendahara: how service tax is counted cannot change once a return is filed
-- (#222, 20261202110000_bendahara_sst_basis_after_filed.sql). Run it after that
-- migration, in the same transaction for a dry run, or by itself once applied.
-- It leaves nothing behind either way: the block always ends with RAISE, so
-- every row below is rolled back. Read the message:
--   BENDAHARA_SST_BASIS_AFTER_FILED_CHECK PASSED ...   or   ... FAILED: <what went wrong>
-- It acts as a workspace's owner the way the app does (the authenticated role
-- with that person's id in request.jwt.claims, at aal2).
do $$
declare
  org uuid := gen_random_uuid();
  owner_id uuid := gen_random_uuid();
  owner_claims text;
  n integer;
  basis text;
  label text;
  got text;
  fails text[] := '{}';
begin
  execute $f$
    create function public.bendahara_basis_try(q text) returns text
    language plpgsql security invoker set search_path = '' as $g$
    begin
      execute q;
      return 'ok';
    exception when others then
      return sqlstate || ': ' || sqlerrm;
    end $g$
  $f$;
  execute 'grant execute on function public.bendahara_basis_try(text) to authenticated';

  insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_anonymous)
  values (owner_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    owner_id || '@sst.basis.check.openkuasa-test.dev', '', now(), now(), now(), '{}'::jsonb, '{}'::jsonb, false);
  insert into public.orgs (id, name) values (org, 'SST Basis Check Sdn Bhd');
  insert into public.org_members (org_id, user_id, role) values (org, owner_id, 'owner');
  owner_claims := json_build_object('sub', owner_id, 'role', 'authenticated', 'aal', 'aal2')::text;

  perform set_config('request.jwt.claims', owner_claims, true);
  set local role authenticated;
  insert into public.finance_sst_settings (org_id, period_start_month, service_tax_basis)
    values (org, 9, 'payment');

  -- ---- the guard is there and only the basis is held ------------------------------
  select count(*) into n from pg_trigger
   where tgrelid = 'public.finance_sst_settings'::regclass and not tgisinternal
     and tgname = 'finance_sst_settings_basis_guard';
  if n <> 1 then fails := fails || format('finance_sst_settings_basis_guard is on the table %s times', n); end if;
  select count(*) into n from pg_proc p join pg_namespace s on s.oid = p.pronamespace
   where s.nspname = 'private' and p.proname = 'finance_sst_settings_basis_guard' and p.prosecdef
     and p.proconfig @> array['search_path=""'];
  if n <> 1 then fails := fails || 'finance_sst_settings_basis_guard is not security definer with an empty search_path'::text; end if;
  select count(*) into n from pg_proc p join pg_namespace s on s.oid = p.pronamespace
   where s.nspname = 'private' and p.proname = 'finance_sst_settings_basis_guard'
     and has_function_privilege('authenticated', p.oid, 'execute');
  if n <> 0 then fails := fails || 'authenticated may call finance_sst_settings_basis_guard'::text; end if;

  -- ---- 1: with nothing filed, the basis changes freely ---------------------------
  got := public.bendahara_basis_try(
    format('update public.finance_sst_settings set service_tax_basis = %L where org_id = %L', 'invoice', org));
  if got <> 'ok' then fails := fails || format('1: with nothing filed the change answered %s', got); end if;
  select service_tax_basis into basis from public.finance_sst_settings where org_id = org;
  if basis is distinct from 'invoice' then fails := fails || format('1: the settings read %s, not invoice', basis); end if;

  -- ---- 2: a filed sales return does not hold it, the basis is service tax's ------
  insert into public.finance_sst_returns (org_id, tax_type, period_start, filed_on)
    values (org, 'sales', '2026-09-01', '2026-11-21');
  got := public.bendahara_basis_try(
    format('update public.finance_sst_settings set service_tax_basis = %L where org_id = %L', 'payment', org));
  if got <> 'ok' then fails := fails || format('2: with only a sales return filed the change answered %s', got); end if;

  -- ---- 3: a filed service return holds it, and says which return -----------------
  insert into public.finance_sst_returns (org_id, tax_type, period_start, filed_on)
    values (org, 'service', '2026-09-01', '2026-11-21');
  label := '1 Sep – 31 Oct 2026 service tax';
  got := public.bendahara_basis_try(
    format('update public.finance_sst_settings set service_tax_basis = %L where org_id = %L', 'invoice', org));
  if got is distinct from 'FIN79: The ' || label
       || ' return is marked filed, so the basis it counted on cannot change. Take the filed mark off that return first, then change it.' then
    fails := fails || format('3: with the service return filed the change answered %s', got);
  end if;
  select service_tax_basis into basis from public.finance_sst_settings where org_id = org;
  if basis is distinct from 'payment' then fails := fails || format('3: the refused change still left the settings at %s', basis); end if;

  -- ---- 4: the other columns still save while it is filed -------------------------
  got := public.bendahara_basis_try(
    format('update public.finance_sst_settings set period_start_month = 2, sales_tax_no = %L where org_id = %L', 'B16-1808-32000002', org));
  if got <> 'ok' then fails := fails || format('4: changing the period month while filed answered %s', got); end if;
  -- The app saves all four fields at once, so a save that sends the same basis is not a change.
  got := public.bendahara_basis_try(
    format('update public.finance_sst_settings set period_start_month = 2, service_tax_no = %L, sales_tax_no = %L, service_tax_basis = %L where org_id = %L',
      'W10-1808-32000001', 'B16-1808-32000002', 'payment', org));
  if got <> 'ok' then fails := fails || format('4: a save that resends the same basis answered %s', got); end if;

  -- ---- 5: the mark off, the change, the mark back on ----------------------------
  delete from public.finance_sst_returns where org_id = org and tax_type = 'service' and period_start = '2026-09-01';
  got := public.bendahara_basis_try(
    format('update public.finance_sst_settings set service_tax_basis = %L where org_id = %L', 'invoice', org));
  if got <> 'ok' then fails := fails || format('5: with the mark off the change answered %s', got); end if;
  insert into public.finance_sst_returns (org_id, tax_type, period_start, filed_on)
    values (org, 'service', '2026-09-01', '2026-11-21');
  select s.service_tax_basis into basis
    from public.finance_sst_settings s
    join public.finance_sst_returns r on r.org_id = s.org_id and r.tax_type = 'service'
   where s.org_id = org;
  if basis is distinct from 'invoice' then
    fails := fails || format('5: the mark back on left the basis at %s, not invoice', basis);
  end if;

  -- ---- 6: two filed service returns are both named --------------------------------
  insert into public.finance_sst_returns (org_id, tax_type, period_start, filed_on)
    values (org, 'service', '2026-11-01', '2026-12-20');
  got := public.bendahara_basis_try(
    format('update public.finance_sst_settings set service_tax_basis = %L where org_id = %L', 'payment', org));
  if got is distinct from 'FIN79: The 1 Nov – 31 Dec 2026 service tax return is marked filed, and 1 earlier service return is too'
       || ', so the basis it counted on cannot change. Take the filed mark off those returns first, then change it.' then
    fails := fails || format('6: with two service returns filed the change answered %s', got);
  end if;

  if cardinality(fails) > 0 then
    raise exception 'BENDAHARA_SST_BASIS_AFTER_FILED_CHECK FAILED: %', array_to_string(fails, '; ');
  end if;
  raise exception 'BENDAHARA_SST_BASIS_AFTER_FILED_CHECK PASSED (everything rolled back)';
end $$;
