import { afterAll, beforeAll, expect, test } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { hasSupabaseEnv, supabaseEnvSkipReason } from './setup/supabase';

const testWithSupabase = hasSupabaseEnv ? test : test.skip;

if (!hasSupabaseEnv) console.warn(supabaseEnvSkipReason);

// Cross-tenant isolation is the core security guarantee of the tenancy spine.
// Test identities use anonymous sign-ins: distinct authenticated users for RLS,
// with no email-confirmation step.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function client(): SupabaseClient {
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function anonUserWithOrg(orgName: string) {
  const c = client();
  const { error: authErr } = await c.auth.signInAnonymously();
  expect(authErr, authErr?.message).toBeNull();
  const { data: orgId, error: rpcErr } = await c.rpc(
    'create_org_for_current_user',
    { org_name: orgName },
  );
  expect(rpcErr, rpcErr?.message).toBeNull();
  return { c, orgId: orgId as string };
}

let a: Awaited<ReturnType<typeof anonUserWithOrg>>;
let b: Awaited<ReturnType<typeof anonUserWithOrg>>;

beforeAll(async () => {
  if (!hasSupabaseEnv) return;
  a = await anonUserWithOrg('Org A Sdn Bhd');
  b = await anonUserWithOrg('Org B Sdn Bhd');
});

afterAll(async () => {
  await a?.c.auth.signOut();
  await b?.c.auth.signOut();
});

testWithSupabase('a user sees only their own org', async () => {
  const { data, error } = await a.c.from('orgs').select('id,name');
  expect(error, error?.message).toBeNull();
  const ids = (data ?? []).map((o) => o.id);
  expect(ids).toContain(a.orgId);
  expect(ids).not.toContain(b.orgId);
});

testWithSupabase('a user cannot read another org membership', async () => {
  const { data, error } = await a.c
    .from('org_members')
    .select('org_id')
    .eq('org_id', b.orgId);
  expect(error, error?.message).toBeNull();
  expect(data ?? []).toHaveLength(0);
});
