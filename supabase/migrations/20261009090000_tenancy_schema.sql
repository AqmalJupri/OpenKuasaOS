-- Tenancy spine: orgs + org_members (Plan A, Task 1)
-- RLS is enabled here; policies arrive in 20261009090100_tenancy_rls.sql.

create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now()
);
alter table public.orgs enable row level security;

create table public.org_members (
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','admin','member','viewer')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
alter table public.org_members enable row level security;
create index org_members_user_id_idx on public.org_members(user_id);
