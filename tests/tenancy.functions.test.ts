import { expect, test } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { hasSupabaseEnv, supabaseEnvSkipReason } from './setup/supabase';

const testWithSupabase = hasSupabaseEnv ? test : test.skip;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!hasSupabaseEnv) console.warn(supabaseEnvSkipReason);
const client = () =>
  createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

testWithSupabase('a new user can create an org and becomes its owner', async () => {
  const c = client();
  const { data: auth, error: authErr } = await c.auth.signInAnonymously();
  expect(authErr, authErr?.message).toBeNull();
  const uid = auth.user?.id;

  const { data: orgId, error } = await c.rpc('create_org_for_current_user', {
    org_name: 'Fn Test Sdn Bhd',
  });
  expect(error, error?.message).toBeNull();

  const { data: mem, error: memErr } = await c
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', uid)
    .maybeSingle();
  expect(memErr, memErr?.message).toBeNull();
  expect(mem?.role).toBe('owner');
});

testWithSupabase('a demo visitor joins the demo org as a read-only viewer and cannot write', async () => {
  const c = client();
  const { data: auth, error: anonErr } = await c.auth.signInAnonymously();
  expect(anonErr, anonErr?.message).toBeNull();
  const uid = auth.user?.id;

  const { data: demoId, error } = await c.rpc('join_demo_org');
  expect(error, error?.message).toBeNull();

  // The demo org is shared, so filter to THIS visitor's own membership row.
  const { data: mem, error: memErr } = await c
    .from('org_members')
    .select('role')
    .eq('org_id', demoId)
    .eq('user_id', uid)
    .maybeSingle();
  expect(memErr, memErr?.message).toBeNull();
  expect(mem?.role).toBe('viewer');

  // viewer write must be filtered out by RLS (0 rows affected, no error)
  const { data: updated } = await c
    .from('orgs')
    .update({ name: 'hacked' })
    .eq('id', demoId)
    .select();
  expect(updated ?? []).toHaveLength(0);
});
