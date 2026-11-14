-- Bendahara #222: how service tax is counted cannot change while a service
-- return is marked filed.
--
--   finance_sst_settings.service_tax_basis = 'payment' counts service tax on
--   the money received, and 'invoice' counts it on the invoice issued. A filed
--   return's figures were worked out one way; switching the setting afterwards
--   leaves the filed return standing on a rule the workspace no longer uses,
--   and the next reader of that period cannot tell which way it was counted.
--
-- So the update is refused while any service return is marked filed. Sales
-- returns do not read the setting, so they do not hold it. The way through is
-- the one the app already offers: take the filed mark off, change the setting,
-- mark the return filed again, and file a Pindaan if the figures moved.

create function private.finance_sst_settings_basis_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  latest record;
  n integer;
  label text;
  extra text;
begin
  -- The settings screen saves all four fields on every save, so only a real
  -- change is held. A save that resends the same basis goes through.
  if new.service_tax_basis is not distinct from old.service_tax_basis then
    return new;
  end if;

  select count(*) into n
    from public.finance_sst_returns r
   where r.org_id = new.org_id and r.tax_type = 'service' and r.filed_on is not null;
  if n = 0 then
    return new;
  end if;

  select r.period_start into latest
    from public.finance_sst_returns r
   where r.org_id = new.org_id and r.tax_type = 'service' and r.filed_on is not null
   order by r.period_start desc
   limit 1;

  -- '1 Sep – 31 Oct 2026', or '1 Dec 2026 – 31 Jan 2027', as sstPeriodLabel words it.
  label := private.finance_filed_period_label(new.org_id, latest.period_start, array['service']);
  extra := case
    when n > 1 then format(', and %s earlier service %s %s too',
                           n - 1,
                           case when n = 2 then 'return' else 'returns' end,
                           case when n = 2 then 'is' else 'are' end)
    else ''
  end;

  raise exception
    'The % return is marked filed%, so the basis it counted on cannot change. Take the filed mark off % first, then change it.',
    label,
    extra,
    case when n > 1 then 'those returns' else 'that return' end
    using errcode = 'FIN79';
end $$;

revoke all on function private.finance_sst_settings_basis_guard() from public, anon, authenticated, service_role;

-- `update of service_tax_basis` skips every save that does not name the column.
create trigger finance_sst_settings_basis_guard
  before update of service_tax_basis on public.finance_sst_settings
  for each row execute function private.finance_sst_settings_basis_guard();

-- ---- self-check -----------------------------------------------------------------
do $$
declare
  n integer;
begin
  select count(*) into n from pg_trigger
   where tgrelid = 'public.finance_sst_settings'::regclass and not tgisinternal
     and tgname = 'finance_sst_settings_basis_guard';
  if n <> 1 then raise exception 'the basis guard trigger is on finance_sst_settings % times', n; end if;

  select count(*) into n from pg_proc p join pg_namespace s on s.oid = p.pronamespace
   where s.nspname = 'private' and p.proname = 'finance_sst_settings_basis_guard' and p.prosecdef
     and p.proconfig @> array['search_path=""'];
  if n <> 1 then raise exception 'finance_sst_settings_basis_guard is not security definer with an empty search_path'; end if;

  select count(*) into n from pg_proc p join pg_namespace s on s.oid = p.pronamespace
   where s.nspname = 'private' and p.proname = 'finance_sst_settings_basis_guard'
     and has_function_privilege('authenticated', p.oid, 'execute');
  if n <> 0 then raise exception 'authenticated may call finance_sst_settings_basis_guard'; end if;

  -- The label helper this reads must be the one this file's sentence relies on.
  select count(*) into n from pg_proc p join pg_namespace s on s.oid = p.pronamespace
   where s.nspname = 'private' and p.proname = 'finance_filed_period_label';
  if n <> 1 then raise exception 'finance_filed_period_label is missing'; end if;
end $$;
