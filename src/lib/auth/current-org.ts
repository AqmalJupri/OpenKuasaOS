import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';
export type CurrentOrg = { orgId: string; role: OrgRole };

export async function getCurrentOrg(client: SupabaseClient): Promise<CurrentOrg | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  // RLS lets a member read every row of their org, so scope to the caller.
  const { data, error } = await client
    .from('org_members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data ? { orgId: data.org_id, role: data.role as OrgRole } : null;
}

export async function requireOrg(client: SupabaseClient): Promise<CurrentOrg> {
  const org = await getCurrentOrg(client);
  if (!org) redirect('/onboarding');
  return org;
}
