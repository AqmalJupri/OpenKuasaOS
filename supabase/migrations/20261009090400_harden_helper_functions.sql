-- The membership helpers exist only to be called inside RLS policies; they
-- should not be reachable as public PostgREST RPC endpoints. Revoke EXECUTE
-- from the API roles. RLS policy evaluation still uses them — a policy is
-- applied by the system, not invoked by the caller, so no EXECUTE grant to the
-- caller is required. (Addresses the security advisor's
-- anon/authenticated_security_definer_function_executable warnings.)

revoke execute on function public.is_org_member(uuid) from public, anon, authenticated;
revoke execute on function public.is_org_writer(uuid) from public, anon, authenticated;
