-- Tenancy RLS: membership helpers + policies (Plan A, Task 2)
-- SECURITY DEFINER helpers avoid recursive policy evaluation on org_members.

create or replace function public.is_org_member(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where org_id = target and user_id = auth.uid()
  );
$$;

create or replace function public.is_org_writer(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where org_id = target and user_id = auth.uid() and role <> 'viewer'
  );
$$;

-- orgs: members read; writers (non-viewer) update. No INSERT policy (creation
-- goes through create_org_for_current_user in the next migration).
create policy orgs_select on public.orgs
  for select to authenticated using (public.is_org_member(id));
create policy orgs_update on public.orgs
  for update to authenticated using (public.is_org_writer(id)) with check (public.is_org_writer(id));

-- org_members: members read their org's rows. No INSERT/UPDATE/DELETE policy
-- (membership is written only by SECURITY DEFINER functions).
create policy org_members_select on public.org_members
  for select to authenticated using (public.is_org_member(org_id));
