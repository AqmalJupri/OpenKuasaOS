import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export type CurrentOrg = { orgId: string; role: string };

export async function getCurrentOrg(client: SupabaseClient): Promise<CurrentOrg | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const { data } = await client
    .from('org_members')
    .select('org_id, role')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return data ? { orgId: data.org_id, role: data.role } : null;
}

export async function requireOrg(client: SupabaseClient): Promise<CurrentOrg> {
  const org = await getCurrentOrg(client);
  if (!org) redirect('/onboarding');
  return org;
}
