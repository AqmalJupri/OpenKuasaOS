-- Tenancy functions + demo-org seed (Plan A, Task 3)
-- Org creation and demo-join run as SECURITY DEFINER so org_members needs no
-- open INSERT policy. The seeded org (fixed slug) doubles as the demo org.

create or replace function public.create_org_for_current_user(org_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.orgs (name) values (org_name) returning id into new_id;
  insert into public.org_members (org_id, user_id, role)
  values (new_id, auth.uid(), 'owner');
  return new_id;
end; $$;

insert into public.orgs (name, slug)
values ('Rimba Ventures Sdn Bhd', 'rimba-ventures-demo')
on conflict (slug) do nothing;

create or replace function public.join_demo_org()
returns uuid language plpgsql security definer set search_path = public as $$
declare demo_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select id into demo_id from public.orgs where slug = 'rimba-ventures-demo';
  if demo_id is null then raise exception 'demo org missing'; end if;
  insert into public.org_members (org_id, user_id, role)
  values (demo_id, auth.uid(), 'viewer')
  on conflict (org_id, user_id) do nothing;
  return demo_id;
end; $$;

-- authenticated covers anonymous sign-in users (role = authenticated); the
-- unauthenticated `anon` role cannot create orgs.
revoke all on function public.create_org_for_current_user(text) from public, anon;
grant execute on function public.create_org_for_current_user(text) to authenticated;
revoke all on function public.join_demo_org() from public;
grant execute on function public.join_demo_org() to authenticated;
