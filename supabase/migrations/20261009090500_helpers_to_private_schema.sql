-- Move the RLS membership helpers into a non-exposed `private` schema so they
-- are not reachable as PostgREST RPC endpoints (clears advisor 0028/0029 for
-- them), while RLS policies — and the authenticated role, which RLS requires to
-- hold EXECUTE on a policy's functions — can still use them. Recreates the
-- policies to reference the private helpers, then drops the public ones.

create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.is_org_member(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where org_id = target and user_id = auth.uid()
  );
$$;

create or replace function private.is_org_writer(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where org_id = target and user_id = auth.uid() and role <> 'viewer'
  );
$$;

revoke execute on function private.is_org_member(uuid) from public;
revoke execute on function private.is_org_writer(uuid) from public;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.is_org_writer(uuid) to authenticated;

-- recreate policies to use the private helpers
drop policy if exists orgs_select on public.orgs;
drop policy if exists orgs_update on public.orgs;
drop policy if exists org_members_select on public.org_members;

create policy orgs_select on public.orgs
  for select to authenticated using (private.is_org_member(id));
create policy orgs_update on public.orgs
  for update to authenticated using (private.is_org_writer(id)) with check (private.is_org_writer(id));
create policy org_members_select on public.org_members
  for select to authenticated using (private.is_org_member(org_id));

-- drop the now-unreferenced public helpers
drop function if exists public.is_org_member(uuid);
drop function if exists public.is_org_writer(uuid);
