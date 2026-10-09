-- Table privileges for the authenticated role (Plan A, Task 2 fix).
-- RLS gates which ROWS are visible; the role still needs a table-level grant to
-- touch the table at all. This project's default privileges did not grant DML to
-- authenticated for new public tables, so grant explicitly.
-- Inserts into orgs/org_members happen only through SECURITY DEFINER functions
-- (which run as the owner), so authenticated needs only reads here (+ orgs UPDATE,
-- which the orgs_update RLS policy restricts to non-viewer members).

grant select, update on public.orgs to authenticated;
grant select on public.org_members to authenticated;
