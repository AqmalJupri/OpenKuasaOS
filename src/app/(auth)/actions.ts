'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AuthState = { error: string } | undefined;

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Incorrect email or password.' };
  redirect('/command');
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const orgName = String(formData.get('orgName') ?? '').trim();
  if (!orgName) return { error: 'Please enter your business name.' };

  const supabase = await createClient();
  const { error: signUpErr } = await supabase.auth.signUp({ email, password });
  if (signUpErr) return { error: 'Could not sign up. Try a different email.' };

  const { error: orgErr } = await supabase.rpc('create_org_for_current_user', {
    org_name: orgName,
  });
  if (orgErr) {
    return {
      error: 'Signed up, but creating your workspace failed. Please try again.',
    };
  }

  redirect('/command');
}

export async function demoSignInAction(): Promise<AuthState> {
  const supabase = await createClient();
  const { error: anonErr } = await supabase.auth.signInAnonymously();
  if (anonErr) return { error: 'Demo is unavailable right now.' };
  const { error: joinErr } = await supabase.rpc('join_demo_org');
  if (joinErr) return { error: 'Demo is unavailable right now.' };
  redirect('/command');
}
