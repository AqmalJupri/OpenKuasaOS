# OpenKuasa Backend — Jebat Slice #1 Design

**Date:** 2026-10-09
**Status:** Draft for review
**Module:** Jebat (`reach`) — "Win new leads with AI ads"
**Milestone:** First backend slice of OpenKuasaOS (frontend is complete + live at openkuasa.com)

---

## 1. Context & Goals

OpenKuasaOS is an open-source (AGPL-3.0), self-hostable business OS for Malaysian
SMEs. The entire frontend ships today as static screens over in-file sample data.
This is the **first backend slice**: it stands up authentication, multi-tenancy, a
real database, and the first AI assistant — scoped to the **Jebat** module.

Jebat is designed as an **AI-assistant-first** experience: its Overview screen is an
*"Ask Jebat anything — Jebat, your CMO"* hero plus campaign/lead dashboards. Today the
hero's chat box is a non-functional mockup and every number is a hard-coded array.

**Goal of slice #1:** a signed-in user — or a demo visitor — inside an organization can ask
Jebat a real question (*"Which campaign has the best cost-per-lead?"*) and get a streamed
answer grounded in that org's Postgres data — and the Jebat Overview dashboard renders that
same live data.

### Success criteria
- A new user can sign up, land in an organization, and sign back in (email/password).
- A **looker can click "Explore the demo"** and land in the seeded Rimba Ventures org (read-only) to browse the dashboards and chat with Jebat — no signup required.
- All data access is tenant-isolated by Postgres **RLS** — a user can never read another org's rows, including through the AI tools.
- The Jebat Overview hero is a working streaming chat that answers from the signed-in org's campaigns/leads/appointments via a **multi-layer agent** (orchestrator + Analyst/Optimizer/Copywriter sub-agents).
- The Jebat Overview charts/KPIs render live from Supabase (no visual regression vs. the current seeded numbers).
- Nothing is Vercel-coupled; the slice deploys on the existing Netlify setup.

---

## 2. Scope

### In scope (slice #1)
1. **Auth & tenancy spine** — Supabase auth (email/password), `orgs` + `org_members` (incl. a read-only `viewer` role), RLS, session middleware, functional login + signup/onboarding, and a **one-click read-only "Explore the demo"** session. The Google button stays visually but fires a *"not enabled yet"* toast.
2. **Jebat data** — `campaigns`, `leads`, `appointments` tables (org-scoped, RLS), seeded with the existing Rimba Ventures fictional numbers.
3. **Ask-Jebat multi-layer agent** — an AI SDK streaming route handler (orchestrator + sub-agents) + RLS-enforced tools + `useChat` wired into the existing hero.
4. **Live Jebat Overview** — `reach/assistant.tsx` reads campaigns/leads/appointments from Supabase.
5. **Provider/config** — provider-agnostic AI via env (default **OpenRouter**, direct Anthropic optional), `.env.example`.

### Out of scope (later slices — see §11)
- Other Jebat screens (ad-studio, creative-bank, contacts, lead-forms, reports, ad-settings) reading live data.
- The **autonomous agents** (`reach/agents.tsx` "always-on crew") — a multi-agent framework + persistent service (**slice 3**). Deliberately deferred.
- Channels (WhatsApp/Telegram — the Chat SDK layer).
- Other modules (Kasturi/Lekiu/Lekir/Bendahara) and the cross-app Taming Sari assistant.
- Packaging: Deploy-to-Netlify/Vercel buttons, Cloudflare-in-front hardening.
- Workspace switcher (multi-org-per-user UX).

### Roadmap (one numbering scheme — *slices*)
| Slice | Scope | Runtime |
|---|-----------|---------|
| **1 (this spec)** | Tenancy spine (auth, orgs, RLS) + Ask-Jebat multi-layer chat + Jebat data & live dashboards | Netlify + Supabase |
| 2 | Remaining Jebat screens on live data + an events/metrics model | Netlify + Supabase |
| 3 | Autonomous agents ("always-on crew") | Separate persistent service (Mastra lean / Eve) |
| 4 | Channels (WhatsApp/Telegram) | Separate service (Chat SDK) |
| 5 | Packaging (deploy buttons, Cloudflare in front, workspace switcher) | — |

---

## 3. Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Agent runtime | **Multi-layer agents on the Vercel AI SDK, in Next.js route handlers** | Orchestrator + specialist sub-agents via the AI SDK "agents-as-tools" pattern. Portable, serverless-friendly, runs on Netlify today with zero new infra. The AI SDK is the substrate Mastra/Eve build on, so it is never thrown away. **Considered the OpenRouter *Agent* SDK and rejected it** for slice #1: OpenRouter-only (gateway lock), public beta, no first-class sub-agents, and no mature web-UI/`useChat` streaming — we keep OpenRouter as the *provider* instead. |
| Dedicated agent framework | **Deferred to slice #4; Mastra the current lean** | A framework earns its place only for the *autonomous* crew (durable execution, schedules, memory, HITL). Eve needs a separate persistent Nitro server + store + sandbox; **Mastra** is AI-SDK-native and embeddable. Not needed for conversational chat; slice #1 agent definitions carry over. |
| Database/auth | **Supabase (Postgres + Auth), RLS from day one** | Matches the project's stated stack; RLS gives tenant isolation that also protects the AI tools. |
| Auth scope | **Full signup + onboarding + a read-only demo login** | User choice. The demo session lets lookers explore the app before signing up. Google OAuth is **deferred** (external GCP setup); the button shows a *"not enabled yet"* toast. |
| Data scope | **Chat tools + live Jebat Overview dashboards** | User choice. Tables are seeded anyway; wiring the dashboard reads keeps dashboard and assistant in sync. |
| LLM provider | **OpenRouter default (`@openrouter/ai-sdk-provider`), per-layer model config; direct Anthropic supported** | One key → any model; a strong model for the orchestrator, cheap/fast models for sub-agents (cost control when every turn fans out). Provider-agnostic; self-hosters swap via env. Trade-off: prompts route through OpenRouter (a US intermediary) on top of the model provider. |
| AI gateway | **Optional, off by default (self-hoster choice)**; never Vercel AI Gateway | A Cloudflare AI Gateway base URL can add caching/rate-limit/observability, but it's a *second* US intermediary on the data path — so it's opt-in, not a default. |
| Hosting | **Netlify stays primary**; Cloudflare in front later | User steer: avoid Vercel where possible; one-click Deploy-to-Vercel is a *self-hoster button* (later), not a migration of openkuasa.com. |

---

## 4. Architecture

### 4.1 Auth & tenancy spine

**Session middleware.** Add a root `middleware.ts` (currently absent) that calls the
existing `src/lib/supabase/middleware.ts#updateSession`, refreshing the Supabase session
cookie on each request. It no-ops without env credentials (already handled), so local dev
without a project still runs.

**Login** (`src/app/(auth)/login/page.tsx`). Replace the static `action="/command"` form
with a **server action** calling `supabase.auth.signInWithPassword`. Show inline error
state on failure; on success redirect to `/command`. The "Sign in with Google" button
stays for visual completeness but is a client control that fires a *"Google sign-in isn't
enabled yet"* toast — no OAuth is wired this slice (deferred, see §11).

**Explore the demo** (default login). A prominent "Explore the demo" control calls a server
action that uses **Supabase anonymous sign-ins** (`signInAnonymously`) to give each visitor
their *own* ephemeral session, then calls a `SECURITY DEFINER` function `join_demo_org()`
that adds the anon user as a `viewer` of the seeded demo org (found by a well-known slug).
Per-visitor anon sessions avoid a shared account that anyone could hijack via
`auth.updateUser()` (RLS does not govern `auth.*`). The `viewer` role makes RLS read-only, so
the dashboards + chat tools work fully in demo mode. Redirects to `/command`; gated by
`NEXT_PUBLIC_DEMO_ENABLED`. (Anonymous users accrue — note a periodic cleanup as maintenance.)

**Signup / onboarding** (`src/app/(auth)/onboarding/page.tsx`). Wire the wizard to:
1. `supabase.auth.signUp` (email/password), then
2. create the user's **organization** (name from the onboarding form) and an `org_members`
   row making them `owner`. Org creation runs in a server action via a `SECURITY DEFINER`
   Postgres function `create_org_for_current_user(name)` so RLS can stay strict (see §4.2).

**Current org resolution.** Slice #1 uses the user's **first** `org_members` row (single
active org). A helper `getCurrentOrg()` (server) returns `{ orgId, role }` or `null`.
A `requireOrg()` wrapper throws/redirects when absent. A workspace switcher is a later slice.

### 4.2 Data model

All tables carry `org_id uuid not null references orgs(id)` and have RLS enabled. All
timestamps `timestamptz default now()`.

```sql
-- tenancy
orgs(id uuid pk default gen_random_uuid(), name text not null, slug text unique, created_at)
org_members(
  org_id uuid references orgs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member','viewer')) default 'owner',
  created_at,
  primary key (org_id, user_id)
)

-- jebat
campaigns(
  id uuid pk, org_id, name text not null,
  channel text,                      -- 'whatsapp'|'facebook'|'instagram'|'tiktok'
  status text check (status in ('active','paused')) default 'active',
  leads_count int default 0,
  spend_cents bigint default 0,      -- money in cents to avoid float drift
  cpl_cents bigint,                  -- cost per lead
  created_at
)
leads(
  id uuid pk, org_id, name text,
  channel text, stage text,          -- 'lead'|'contacted'|'qualified'|'booked'|'won'
  source text, created_at
)
appointments(
  id uuid pk, org_id, contact_name text,
  kind text, scheduled_at timestamptz, via text, created_at
)
```

**RLS model.** A `SECURITY DEFINER` helper avoids recursive policy evaluation:

```sql
create function is_org_member(target uuid) returns boolean
  language sql security definer stable as $$
    select exists (
      select 1 from org_members
      where org_id = target and user_id = auth.uid()
    );
  $$;
```

A companion `is_org_writer(target)` (same shape, `and role <> 'viewer'`) gates writes so the
demo `viewer` is read-only.

Policies: `orgs` — select where `is_org_member(id)`, update where `is_org_writer(id)`;
`org_members` — select where `is_org_member(org_id)`; `campaigns`/`leads`/`appointments` —
**select** where `is_org_member(org_id)`, **insert/update/delete** where
`is_org_writer(org_id)` (`with check (is_org_writer(org_id))`). **`org_members` has no general INSERT policy** in
slice #1 — the only inserts run through `SECURITY DEFINER` functions:
`create_org_for_current_user()` (owner, on signup) and `join_demo_org()` (viewer, on demo).
Member invites get their own INSERT policy in a later slice.

**Seed & derivation.** A **Supabase CLI migration** (runs as service role, bypasses RLS)
seeds org "Rimba Ventures Sdn Bhd" (with a well-known demo slug) plus its Jebat rows,
mirroring the current `reach/assistant.tsx` numbers so the dashboard doesn't regress:
- `campaigns` stores **ad-platform-reported** `leads_count`/`spend_cents`/`cpl_cents` — campaign-level figures, intentionally *not* reconciled against CRM `leads` rows, so there is no denormalization "drift" to manage.
- `leads` are CRM records (~dozens) seeded with varied `channel`, `stage`, and `created_at` across ~8 weeks, so **leads-by-channel, the funnel (count by stage), totals, conversion %, and the weekly trend are all derived live** from them.
- Two widgets have **no natural source** and stay display-only in slice #1 (real model in slice 2): the *best-time-to-engage heatmap* and the *ad-engine-health gauge*.

This seeded org **doubles as the demo org** — visitors join it as `viewer` via `join_demo_org()` (no demo user is pre-created).

### 4.3 Ask-Jebat — multi-layer agent

**Route handler** `src/app/api/reach/chat/route.ts` (POST):
- Resolve session → `requireOrg()`; no session → `401`.
- Run the **orchestrator** with `streamText` (multi-step, `stopWhen: stepCountIs(n)`),
  returning `result.toUIMessageStreamResponse()`.
- Models come from the provider factory (OpenRouter by default), chosen **per layer** (§4.4).

**Layer 1 — Orchestrator "Jebat" (CMO).** System prompt = the *"Jebat, your CMO"* persona
(concise, practical, Malaysian SME voice, RM, may address the user as "Saudara"). It plans
and delegates to sub-agents; it never touches the database directly. Hard rule: the final
answer uses only what sub-agents/tools returned — never invents numbers.

**Layer 2 — Specialist sub-agents** (each an AI SDK agent with its own prompt + model,
wrapped as a tool via the "agents-as-tools" pattern so the orchestrator can call it):
- **Analyst** — owns the data tools; answers *"what's happening & why."*
- **Optimizer** — reasons over the Analyst's numbers to recommend budget/targeting moves.
- **Copywriter** — drafts ad copy / WhatsApp follow-ups.
These mirror the `reach/agents.tsx` roster; the **same definitions power the autonomous crew
in slice 3** (just a different runtime).

**Layer 3 — Tools** (Zod input schemas; each uses the server Supabase client, so **RLS
scopes every query to the caller's org automatically** — `org_id` is never taken from the
model):
- `getCampaigns({ status?: 'active'|'paused' })`, `getLeadSummary({ sinceDays?: number })`,
  `getSpendByChannel()`, `getUpcomingAppointments({ limit?: number })`.

**Client.** Replace the mock hero input block in `reach/assistant.tsx` with a client
component using `useChat` (`@ai-sdk/react`) → `/api/reach/chat`. The three suggested prompts
become real quick-starts. Responses stream into an expandable panel in the hero; the hero's
visual design is preserved. The hero surfaces which sub-agent is working, from the stream's
step/tool events.

### 4.4 Provider & configuration

Env (documented in a new committed `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only; used only by seed/admin scripts, never in request path
OPENROUTER_API_KEY=               # default provider (one key, any model)
OPENKUASA_MODEL_ORCHESTRATOR=     # strong model, e.g. anthropic/claude-sonnet (OpenRouter id)
OPENKUASA_MODEL_WORKER=           # cheap/fast model for sub-agents
ANTHROPIC_API_KEY=                # optional: set to use direct Anthropic instead of OpenRouter
AI_GATEWAY_BASE_URL=              # optional: Cloudflare AI Gateway (can front OpenRouter)
NEXT_PUBLIC_DEMO_ENABLED=         # optional: '1' to show the "Explore the demo" button (anonymous sign-in)
```
The app's request path uses only the anon key + user session (RLS). The service-role key is
confined to migration/seed tooling. A small provider factory selects the LLM provider
(OpenRouter by default; direct Anthropic when `ANTHROPIC_API_KEY` is set), so no app logic
depends on a specific provider — self-hosters switch with env alone.

---

## 5. Data Flow (Ask-Jebat request)

1. Browser `useChat` POSTs messages to `/api/reach/chat` (session cookie attached).
2. Middleware has refreshed the session; handler calls `getCurrentOrg()`.
3. `streamText` runs; the model calls e.g. `getLeadSummary`.
4. The tool queries Supabase with the **anon key + user session** → RLS restricts rows to the caller's org.
5. Tool result returns to the model; it composes an answer; tokens stream back via the UI message stream.
6. `useChat` renders the streaming answer in the hero panel.

At no point does the model supply an `org_id`; isolation is enforced by Postgres, not by prompt.

---

## 6. Error Handling
- **No session** → `401` from the route; client shows a "please sign in" state.
- **Signed in, no org** → redirect to `/onboarding`.
- **Tool query error** → tool returns a structured error; model is instructed to surface a brief apology, not raw SQL.
- **Model/provider error or missing key** → `500` with a generic message; detail logged server-side only.
- **Rate limits** (provider or gateway) → surfaced as a friendly "busy, try again" message.
- **Auth failures** (bad password, taken email) → inline form errors, no enumeration leaks.
- **Demo visitor hits a write action** (Save/Submit) → a "sign up to save your changes" prompt, never a raw RLS error.

---

## 7. Testing
- **Unit:** each tool's query shape; `getCurrentOrg()`; the funnel/summary aggregation math.
- **RLS:** a test that user A cannot read user B's campaigns/leads (direct query + via a tool call) — the core security guarantee.
- **Demo read-only:** the demo `viewer` can read campaigns/leads but any insert/update/delete is rejected by RLS.
- **Integration:** POST `/api/reach/chat` with a seeded session returns a streaming response and invokes at least one tool.
- **Manual smoke (pre-merge gate):** sign up → create org → open Jebat Overview (live charts) → ask "which campaign has the best cost per lead?" → verify a grounded streamed answer.
- **Supabase advisors:** run the security/performance advisors after migrations; resolve any RLS gaps before merge.

---

## 8. Security & Independence
- RLS on every table; the AI tools inherit it. Service-role key never in the request path.
- AGPL self-hostable: provider-agnostic, BYO key/model; no hosted-only dependency.
- Independence rules upheld: fictional seed data only (Rimba Ventures, `.my`/`@openkuasa.com`), no competitor-overlapping SaaS names, no Kuasa references.
- Secrets via env only; `.env*` stays gitignored; only `.env.example` is committed.

---

## 9. Affected / New Files (orientation for the plan)
- **New:** `middleware.ts`; `src/app/api/reach/chat/route.ts`; `src/app/(auth)/actions.ts` (sign-in / sign-up+org / demo sign-in server actions); `src/lib/auth/current-org.ts`; `src/lib/ai/{provider,tools}.ts`; `src/lib/ai/agents/{orchestrator,analyst,optimizer,copywriter}.ts`; `src/lib/supabase/queries/reach.ts`; `.env.example`; SQL migrations + seed/admin script.
- **Changed:** `src/app/(auth)/login/page.tsx` (server action + "Explore the demo" + Google toast); `src/app/(auth)/onboarding/page.tsx` (signup + org creation); `src/screens/reach/assistant.tsx` (live data + `useChat` hero).
- **Deps (installed 2026-10-09):** `ai@7.0.133`, `@ai-sdk/react@4.0.136`, `@openrouter/ai-sdk-provider@3.1.0`, `zod@4.6.5`. Add `@ai-sdk/anthropic` only if/when the direct-Anthropic path is turned on.

---

## 10. Risks & Plan-Stage Safeguards
- **Supabase project identity** — three Supabase MCP servers are wired (`supabase`, `supabase-postvote`, `claude_ai_Supabase`). **Confirm which project is OpenKuasa's before any `apply_migration`** (same failure class as the earlier wrong-account Netlify MCP incident). If none is OpenKuasa's, create/connect one explicitly first.
- **Spike these three *before* writing the plan** (load-bearing, currently assumed settled): (1) `@openrouter/ai-sdk-provider` supports per-layer / per-call model selection as specced; (2) the AI SDK "agents-as-tools" multi-layer pattern composes with streaming; (3) `toUIMessageStreamResponse()` actually *streams* (not buffers) through `@netlify/plugin-nextjs`. Each is a short probe; if (3) fails, reconsider the route-handler transport before the plan depends on it.
- **Next.js 16 specifics** — per `AGENTS.md`, read the bundled `node_modules/next/dist/docs/` for route-handler/streaming/server-action conventions before coding; APIs may differ from training data.
- **AI SDK is v7** (`ai@7` / `@ai-sdk/react@4`) — newer than most examples; `streamText` / `useChat` / `toUIMessageStreamResponse` can differ from v5-era patterns. Read current AI SDK v7 docs (ai-sdk.dev / context7) before coding; the streaming spike also verifies `@ai-sdk/react@4` ↔ `ai@7` compatibility.
- **Google OAuth** needs an external GCP OAuth client + redirect config — hence deferred this slice (the button shows a *"not enabled yet"* toast); not a blocker for the core flow.
- **Cost** — multi-layer fans out into many model calls. Use cheap/fast models for sub-agents and a strong model only for the orchestrator (per-layer env), cap tool-call steps, and note provider spend for the user.
- **`claude-api` skill drift** — that skill steers toward the direct Anthropic SDK; the user explicitly chose the AI SDK with OpenRouter. User instruction wins.

---

## 11. Future Slices (not now) — see the Roadmap table in §2
- **Slice 2:** remaining Jebat screens on live data + an events/metrics model (makes the trend/heatmap/health widgets live).
- **Slice 3:** autonomous agents (`reach/agents.tsx`) on a persistent service via Mastra (lean) or Eve — framework chosen then; slice-1 agent definitions carry over.
- **Slice 4:** channels (WhatsApp/Telegram) via the Chat SDK.
- **Slice 5:** packaging — Deploy-to-Netlify/Vercel buttons, Cloudflare in front, workspace switcher.
- **Not slice-bound:** Google OAuth (+ `/auth/callback`) once a GCP OAuth client exists (replaces the toast); periodic cleanup of anonymous demo users.
- Replicate the pattern across Kasturi/Lekiu/Lekir/Bendahara + the cross-app Taming Sari assistant.
