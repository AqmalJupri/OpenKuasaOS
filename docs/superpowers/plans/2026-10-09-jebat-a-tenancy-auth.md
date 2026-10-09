# Jebat Backend — Plan A: Tenancy & Auth Spine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up Supabase auth + multi-tenant orgs with RLS, plus a functional login / signup-onboarding / demo flow, so every request runs as an authenticated, org-scoped identity.

**Architecture:** Postgres holds `orgs` + `org_members` (with a read-only `viewer` role); all tenant isolation is enforced by RLS via two `SECURITY DEFINER` helpers (`is_org_member`, `is_org_writer`). Org creation and demo-join happen through `SECURITY DEFINER` functions so `org_members` needs no open INSERT policy. Next.js middleware refreshes the Supabase session; server actions drive login, signup+org-creation, and a per-visitor anonymous "demo" sign-in.

**Tech Stack:** Next.js 16 (App Router, server actions, middleware), `@supabase/ssr`, `@supabase/supabase-js`, Supabase Postgres + RLS, Vitest (integration tests against the live dev project).

**Spec:** `docs/superpowers/specs/2026-10-09-jebat-backend-slice1-design.md` (§4.1, §4.2)

**Supabase project:** ref `ugchntdgaeefmufumchx` ("OpenKuasa's Project", ap-southeast-1). Apply migrations via the `openkuasa-supabase` MCP (`apply_migration`); run assertions via `execute_sql`.

## Global Constraints

- **Branch/PR:** work on `feat-035-jebat-tenancy-auth` (verify `gh api user` is `OpenKuasa` before any push); branch→PR→squash-merge, never push `main`, PR title = branch name, never delete the branch.
- **Package manager:** `pnpm` only.
- **TypeScript:** strict; 2-space indent, single quotes, semicolons; `const` by default; named exports; async/await.
- **Next.js 16 is not the Next.js in your training** — per `AGENTS.md`, read the relevant file under `node_modules/next/dist/docs/` before writing middleware or server actions.
- **RLS on every table**, from creation. The service-role key never appears in the request path; migrations/seed run through the MCP (management API), not the app.
- **Independence:** no Kuasa names, no competitor-SaaS names; all sample/seed data fictional — org `Rimba Ventures Sdn Bhd`, `@openkuasa.com` / `.my` domains only.
- **`.env.local`** already holds `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENROUTER_API_KEY`, model vars, `OPENKUASA_SUPABASE_TOKEN`. It is gitignored and `.env*` is Read-denied to the agent — never read or write it; ask the user for any value you need.

## Review Focus

- **Cross-org read** — user B queries and must see zero of user A's `orgs`/`org_members` rows. (Test: Task 2.)
- **Demo viewer write** — an anonymous `viewer` attempts INSERT/UPDATE/DELETE on a tenant table and is denied by RLS. (Test: Task 3; re-checked per-table in Plan B.)
- **Signed-in but org-less** — a user whose org creation failed (or who signed up and abandoned) hits an app route; `requireOrg()` redirects to `/onboarding` instead of throwing. (Test: Task 5.)
- **Duplicate / taken email signup** — returns a friendly inline error, no account-enumeration leak and no stack trace. (Test: Task 6.)
- **Double org creation** — calling `create_org_for_current_user` makes the caller `owner` of a fresh org each call, never corrupts an existing membership. (Test: Task 3.)

---

## Task 1: Tenancy schema migration

**Files:**
- Migration (via MCP `apply_migration`, name `tenancy_schema`)
- Assertion (via MCP `execute_sql`)

**Interfaces:**
- Produces: tables `public.orgs(id uuid, name text, slug text unique, created_at timestamptz)`, `public.org_members(org_id uuid, user_id uuid, role text, created_at timestamptz, pk(org_id,user_id))` with RLS enabled. Later tasks and Plan B reference `orgs.id` and `org_members(org_id,user_id,role)`.

- [ ] **Step 1: Write the assertion (expected to fail first)**

Run via `execute_sql`:
```sql
select
  (select count(*) from information_schema.tables where table_schema='public' and table_name in ('orgs','org_members')) as tables,
  (select count(*) from pg_tables where schemaname='public' and tablename in ('orgs','org_members') and rowsecurity) as rls_enabled;
```
Expected now: `tables=0, rls_enabled=0`.

- [ ] **Step 2: Apply the migration** (`apply_migration`, name `tenancy_schema`):
```sql
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
```

- [ ] **Step 3: Re-run the assertion**

Expected now: `tables=2, rls_enabled=2`. With RLS enabled and **no policies yet**, both tables are deny-all to `authenticated` — that is correct and intended until Task 2.

---

## Task 2: RLS helpers, policies, and the isolation test (security centerpiece)

**Files:**
- Migration (`apply_migration`, name `tenancy_rls`)
- Create: `vitest.config.ts`, `tests/setup/supabase.ts`, `tests/tenancy.rls.test.ts`
- Modify: `package.json` (add `test` script + dev deps)

**Interfaces:**
- Produces: SQL `public.is_org_member(target uuid) -> boolean`, `public.is_org_writer(target uuid) -> boolean`; SELECT policies on `orgs`/`org_members`; UPDATE policy on `orgs`. Plan B's tenant tables reuse both helpers.
- Consumes: Task 1 tables.

- [ ] **Step 1: Add the test harness** (fold setup into this task). Install dev deps:
```bash
pnpm add -D vitest dotenv
```
Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['tests/setup/supabase.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
});
```
Create `tests/setup/supabase.ts` (loads the gitignored env the same file the app uses):
```ts
import { config } from 'dotenv';

config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}
```
Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 2: Write the failing isolation test**

Create `tests/tenancy.rls.test.ts`. It uses real anon-key sign-ups (two throwaway users), each creating an org, then asserts neither can see the other's rows. (Org creation RPC lands in Task 3; this test imports it by name now and will stay red until both Task 2 policies and Task 3 RPC exist — run it after Task 3 too.)
```ts
import { afterAll, beforeAll, expect, test } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function client(): SupabaseClient {
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function signUpWithOrg(orgName: string) {
  const c = client();
  const email = `rls-${crypto.randomUUID()}@openkuasa.test`;
  const password = `Pw-${crypto.randomUUID()}`;
  const { error: signUpErr } = await c.auth.signUp({ email, password });
  expect(signUpErr, signUpErr?.message).toBeNull();
  const { data: orgId, error: rpcErr } = await c.rpc('create_org_for_current_user', { org_name: orgName });
  expect(rpcErr, rpcErr?.message).toBeNull();
  return { c, orgId: orgId as string, email };
}

let a: Awaited<ReturnType<typeof signUpWithOrg>>;
let b: Awaited<ReturnType<typeof signUpWithOrg>>;

beforeAll(async () => {
  a = await signUpWithOrg('Org A Sdn Bhd');
  b = await signUpWithOrg('Org B Sdn Bhd');
});

afterAll(async () => {
  await a?.c.auth.signOut();
  await b?.c.auth.signOut();
});

test('a user sees only their own org', async () => {
  const { data } = await a.c.from('orgs').select('id,name');
  const ids = (data ?? []).map((o) => o.id);
  expect(ids).toContain(a.orgId);
  expect(ids).not.toContain(b.orgId);
});

test('a user cannot read another org membership', async () => {
  const { data } = await a.c.from('org_members').select('org_id').eq('org_id', b.orgId);
  expect(data ?? []).toHaveLength(0);
});
```

- [ ] **Step 3: Run the test — verify it fails**

Run: `pnpm test tests/tenancy.rls.test.ts`
Expected: FAIL (RPC `create_org_for_current_user` not found and/or deny-all RLS).

- [ ] **Step 4: Apply the RLS migration** (`apply_migration`, name `tenancy_rls`):
```sql
create or replace function public.is_org_member(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.org_members where org_id = target and user_id = auth.uid());
$$;

create or replace function public.is_org_writer(target uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where org_id = target and user_id = auth.uid() and role <> 'viewer'
  );
$$;

create policy orgs_select on public.orgs
  for select to authenticated using (public.is_org_member(id));
create policy orgs_update on public.orgs
  for update to authenticated using (public.is_org_writer(id)) with check (public.is_org_writer(id));

create policy org_members_select on public.org_members
  for select to authenticated using (public.is_org_member(org_id));
```
(No INSERT/UPDATE/DELETE policy on `org_members`, and no INSERT policy on `orgs` — writes go only through the Task 3 `SECURITY DEFINER` functions.)

- [ ] **Step 5: Re-run after Task 3 exists** — the two tests must PASS once Task 3's RPC is in place. Keep this file; it is re-run as the Task 3 gate.

- [ ] **Step 6: Commit**
```bash
git add vitest.config.ts tests/ package.json pnpm-lock.yaml
git commit -m "feat(tenancy): rls helpers, policies, and isolation test harness"
```

---

## Task 3: Org-creation + demo-join functions + demo-org seed

**Files:**
- Migration (`apply_migration`, name `tenancy_functions_and_seed`)
- Create: `tests/tenancy.functions.test.ts`

**Interfaces:**
- Produces: `public.create_org_for_current_user(org_name text) -> uuid` (makes caller `owner`); `public.join_demo_org() -> uuid` (adds caller as `viewer` of the demo org); a seeded org with slug `rimba-ventures-demo`. Plan A Task 6 and Plan B's demo rely on these names.
- Consumes: Task 1 tables, Task 2 helpers.

- [ ] **Step 1: Write the failing tests**

Create `tests/tenancy.functions.test.ts`:
```ts
import { expect, test } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = () => createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });

test('new signup can create an org and becomes its owner', async () => {
  const c = client();
  await c.auth.signUp({ email: `fn-${crypto.randomUUID()}@openkuasa.test`, password: `Pw-${crypto.randomUUID()}` });
  const { data: orgId, error } = await c.rpc('create_org_for_current_user', { org_name: 'Fn Test Sdn Bhd' });
  expect(error, error?.message).toBeNull();
  const { data: mem } = await c.from('org_members').select('role').eq('org_id', orgId).single();
  expect(mem?.role).toBe('owner');
});

test('demo visitor joins the demo org as a read-only viewer and cannot write', async () => {
  const c = client();
  const { error: anonErr } = await c.auth.signInAnonymously();
  expect(anonErr, anonErr?.message).toBeNull();
  const { data: demoId, error } = await c.rpc('join_demo_org');
  expect(error, error?.message).toBeNull();
  const { data: mem } = await c.from('org_members').select('role').eq('org_id', demoId).single();
  expect(mem?.role).toBe('viewer');
  // viewer write must be rejected by RLS (0 rows affected / error)
  const { data: updated } = await c.from('orgs').update({ name: 'hacked' }).eq('id', demoId).select();
  expect(updated ?? []).toHaveLength(0);
});
```

- [ ] **Step 2: Run — verify failure**

Run: `pnpm test tests/tenancy.functions.test.ts`
Expected: FAIL (functions not defined). Enable anonymous sign-ins first if `signInAnonymously` errors: Supabase dashboard → Authentication → Providers → **Anonymous** → enable (one-time; note it for the user).

- [ ] **Step 3: Apply the migration** (`apply_migration`, name `tenancy_functions_and_seed`):
```sql
create or replace function public.create_org_for_current_user(org_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.orgs (name) values (org_name) returning id into new_id;
  insert into public.org_members (org_id, user_id, role) values (new_id, auth.uid(), 'owner');
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

revoke all on function public.create_org_for_current_user(text) from public, anon;
grant execute on function public.create_org_for_current_user(text) to authenticated;
revoke all on function public.join_demo_org() from public;
grant execute on function public.join_demo_org() to authenticated;
```

- [ ] **Step 4: Run both test files — verify pass**

Run: `pnpm test tests/tenancy.functions.test.ts tests/tenancy.rls.test.ts`
Expected: PASS (all four tests).

- [ ] **Step 5: Commit**
```bash
git add tests/tenancy.functions.test.ts
git commit -m "feat(tenancy): org-creation + demo-join functions and demo org seed"
```

---

## Task 4: Session middleware

> **RESOLVED during execution:** Next.js 16 renamed `middleware` → **proxy**, and
> `src/proxy.ts` already wires `updateSession` with the matcher. No `middleware.ts`
> is created (it would be deprecated and conflict), so this task is satisfied by the
> existing `src/proxy.ts`. The steps below are kept for historical context.

**Files:**
- Create: `middleware.ts` (repo root)

**Interfaces:**
- Consumes: existing `src/lib/supabase/middleware.ts#updateSession` (already present; no-ops without env).
- Produces: a live session-refresh on every matched request (keeps `getUser()`-based auth working in server components/actions).

- [ ] **Step 1: Read the Next 16 middleware doc** — `node_modules/next/dist/docs/` (middleware + matcher). Confirm the `config.matcher` shape and that `middleware.ts` belongs at the repo root (not under `src/`) for this project's layout.

- [ ] **Step 2: Create `middleware.ts`:**
```ts
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

- [ ] **Step 3: Verify it loads** — `pnpm dev`, open any page, confirm no middleware error in the server log and the page still renders. (Full session behavior is exercised in Task 7's smoke.)

- [ ] **Step 4: Commit**
```bash
git add middleware.ts
git commit -m "feat(auth): wire supabase session-refresh middleware"
```

---

## Task 5: Current-org helper

**Files:**
- Create: `src/lib/auth/current-org.ts`, `tests/current-org.test.ts`

**Interfaces:**
- Produces: `getCurrentOrg(client): Promise<{ orgId: string; role: string } | null>` and `requireOrg(client): Promise<{ orgId: string; role: string }>` (redirects to `/onboarding` when null). Takes an injected Supabase client so it is unit-testable and reusable by route handlers (Plan C) and server components (Plan B).
- Consumes: `org_members` (Task 1), RLS (Task 2).

- [ ] **Step 1: Write the failing test**

Create `tests/current-org.test.ts` (pure unit test with a fake client — no network):
```ts
import { expect, test, vi } from 'vitest';
import { getCurrentOrg } from '@/lib/auth/current-org';

function fakeClient(user: { id: string } | null, membership: { org_id: string; role: string } | null) {
  return {
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({ maybeSingle: async () => ({ data: membership, error: null }) }),
        }),
      }),
    }),
  } as any;
}

test('returns null when not signed in', async () => {
  expect(await getCurrentOrg(fakeClient(null, null))).toBeNull();
});

test('returns null when signed in but org-less', async () => {
  expect(await getCurrentOrg(fakeClient({ id: 'u1' }, null))).toBeNull();
});

test('returns orgId + role for a member', async () => {
  expect(await getCurrentOrg(fakeClient({ id: 'u1' }, { org_id: 'o1', role: 'owner' }))).toEqual({
    orgId: 'o1',
    role: 'owner',
  });
});
```

- [ ] **Step 2: Run — verify failure**

Run: `pnpm test tests/current-org.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/auth/current-org.ts`:**
```ts
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';
export type CurrentOrg = { orgId: string; role: OrgRole };

export async function getCurrentOrg(client: SupabaseClient): Promise<CurrentOrg | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  // MUST filter by user_id: org_members_select RLS lets a member see ALL of
  // their org's rows, so an unfiltered order+limit would return the earliest
  // (owner's) row and mis-report the caller's role.
  const { data, error } = await client
    .from('org_members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error; // a DB error must not look like "org-less"
  return data ? { orgId: data.org_id, role: data.role as OrgRole } : null;
}

export async function requireOrg(client: SupabaseClient): Promise<CurrentOrg> {
  const org = await getCurrentOrg(client);
  if (!org) redirect('/onboarding');
  return org;
}
```

- [ ] **Step 4: Run — verify pass**

Run: `pnpm test tests/current-org.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**
```bash
git add src/lib/auth/current-org.ts tests/current-org.test.ts
git commit -m "feat(auth): current-org resolver with onboarding redirect"
```

---

## Task 6: Auth server actions + wire login / onboarding / demo

**Files:**
- Create: `src/app/(auth)/actions.ts`
- Modify: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/onboarding/page.tsx`
- Create: `src/components/auth/google-not-enabled-button.tsx` (client toast), `src/components/auth/demo-button.tsx`

**Interfaces:**
- Consumes: `@/lib/supabase/server#createClient`, `create_org_for_current_user`, `join_demo_org`.
- Produces: server actions `signInAction(formData)`, `signUpAction(formData)`, `demoSignInAction()`.

- [ ] **Step 1: Read the Next 16 server-actions doc** — `node_modules/next/dist/docs/` (server actions, `useActionState`/form `action`). Confirm the current signature and redirect-from-action pattern.

- [ ] **Step 2: Implement `src/app/(auth)/actions.ts`:**
```ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signInAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Incorrect email or password.' };
  redirect('/command');
}

export async function signUpAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const orgName = String(formData.get('orgName') ?? '').trim();
  if (!orgName) return { error: 'Please enter your business name.' };

  const supabase = await createClient();
  const { error: signUpErr } = await supabase.auth.signUp({ email, password });
  if (signUpErr) return { error: 'Could not sign up. Try a different email.' };

  const { error: orgErr } = await supabase.rpc('create_org_for_current_user', { org_name: orgName });
  if (orgErr) return { error: 'Signed up, but creating your workspace failed. Please try again.' };

  redirect('/command');
}

export async function demoSignInAction() {
  const supabase = await createClient();
  const { error: anonErr } = await supabase.auth.signInAnonymously();
  if (anonErr) return { error: 'Demo is unavailable right now.' };
  const { error: joinErr } = await supabase.rpc('join_demo_org');
  if (joinErr) return { error: 'Demo is unavailable right now.' };
  redirect('/command');
}
```

- [ ] **Step 3: Google button → "not enabled yet" toast.** Create `src/components/auth/google-not-enabled-button.tsx` (client component) that renders the existing Google button markup and, on click, shows a toast/inline message "Google sign-in isn't enabled yet." Use the app's existing toast if present; otherwise a local `useState` inline message. Create `src/components/auth/demo-button.tsx` as a client component that calls `demoSignInAction` (visible only when `process.env.NEXT_PUBLIC_DEMO_ENABLED === '1'`).

- [ ] **Step 4: Wire `login/page.tsx`** — replace `<form action="/command">` with the `signInAction` server action (via `useActionState` in a small client form wrapper), show `state.error` inline, swap the static Google `<Link>` for `<GoogleNotEnabledButton />`, and add `<DemoButton />`. Keep all existing Tailwind classes and the visual pane unchanged.

- [ ] **Step 5: Wire `onboarding/page.tsx`** — make its final step submit `email`, `password`, and `orgName` to `signUpAction`; show `state.error` inline. Keep the existing wizard UI.

- [ ] **Step 6: Verify build + lint**

Run: `pnpm build` (or `pnpm lint && pnpm exec tsc --noEmit`)
Expected: compiles with no type errors.

- [ ] **Step 7: Commit**
```bash
git add src/app/\(auth\)/actions.ts src/app/\(auth\)/login/page.tsx src/app/\(auth\)/onboarding/page.tsx src/components/auth/
git commit -m "feat(auth): functional login, signup+org, and demo sign-in"
```

---

## Task 7: Verification — advisors + end-to-end smoke

**Files:** none (verification only)

- [ ] **Step 1: Security advisors.** Via the MCP `get_advisors` (type `security`) on project `ugchntdgaeefmufumchx`. Expected: no ERROR-level findings for `public.orgs` / `public.org_members` (RLS enabled, policies present). Resolve anything flagged (e.g., function `search_path`, missing policy) before proceeding.

- [ ] **Step 2: Full test suite**

Run: `pnpm test`
Expected: all tenancy + current-org tests PASS.

- [ ] **Step 3: Browser smoke** (use the `test` skill / Playwright MCP against `pnpm dev`):
  - Sign up with a fresh email + business name → lands on `/command`.
  - Sign out, sign back in with the same credentials → `/command`.
  - Click **Explore the demo** → lands on `/command` as the demo (anonymous) visitor.
  - Click **Sign in with Google** → shows the "not enabled yet" toast, no navigation.
  - Confirm no secrets or stack traces appear in the client.

- [ ] **Step 4: Record** the manual-smoke result in the PR description (the testing gate before merge).

---

## Self-Review (completed)

- **Spec coverage:** §4.1 auth/tenancy (middleware, login, onboarding, demo, current-org) → Tasks 4–6; §4.2 schema + RLS + helpers + functions + seed → Tasks 1–3. Jebat data tables, live dashboards (§4.2/§4.3 data), and the agent/chat (§4.3) are **Plan B / Plan C** by design.
- **Review Focus:** cross-org (T2), demo viewer write (T3), org-less redirect (T5), duplicate email (T6), double org creation (T3) — each pinned to a task.
- **Types:** `create_org_for_current_user(org_name)`, `join_demo_org()`, `getCurrentOrg`/`requireOrg` signatures consistent across tasks and tests.
- **Open setup item for the user:** enable **Anonymous sign-ins** in the Supabase dashboard (needed by Task 3 / demo) — call this out at execution start.
