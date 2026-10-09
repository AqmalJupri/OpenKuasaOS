-- Defense-in-depth grant tightening (Plan A, final-review cleanup).
-- TRUNCATE/REFERENCES/TRIGGER were granted to anon/authenticated by this project's
-- default privileges. They are unreachable via PostgREST (no verb/RPC, and roles
-- are assumed via JWT, not a direct connection), but they have no business on
-- these tenancy tables — revoke them.
revoke truncate, references, trigger on public.orgs, public.org_members from anon, authenticated;

-- Align join_demo_org's revoke with create_org_for_current_user (which also revokes
-- from anon): on a fresh project whose default privileges grant EXECUTE to anon,
-- revoking only from public would leave anon able to call it without a session.
revoke execute on function public.join_demo_org() from anon;
