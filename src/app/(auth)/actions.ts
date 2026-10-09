'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export type AuthState =
  | {
      error?: string;
      notice?: string;
      values?: { email?: string; orgName?: string };
    }
  | undefined;

const emailSchema = z
  .string()
  .trim()
  .email('Please enter a valid email address.');

// Login only checks presence: the signup password policy must not lock out
// existing accounts.
const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Please enter your password.'),
});

const signUpSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  orgName: z
    .string()
    .trim()
    .min(1, 'Please enter your business name.')
    .max(120, 'Business name must be 120 characters or fewer.'),
});

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const values = { email };

  const parsed = signInSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { error: 'Incorrect email or password.', values };
  redirect('/command');
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const orgName = String(formData.get('orgName') ?? '').trim();
  const values = { email, orgName };

  const parsed = signUpSchema.safeParse({ email, password, orgName });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }

  const supabase = await createClient();

  // A prior attempt may have signed the user in without creating an org.
  // Skip signUp in that case so a retry does not hit "already registered".
  const { data: existing } = await supabase.auth.getUser();
  if (!existing.user || existing.user.is_anonymous) {
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (signUpErr) {
      return { error: 'Could not sign up. Try a different email.', values };
    }
    if (!data.session) {
      return {
        notice: 'Check your email to confirm your account, then sign in.',
        values,
      };
    }
  }

  const { error: orgErr } = await supabase.rpc('create_org_for_current_user', {
    org_name: parsed.data.orgName,
  });
  if (orgErr) {
    return { error: 'Could not create your workspace. Please try again.', values };
  }

  redirect('/command');
}

export async function demoSignInAction(): Promise<AuthState> {
  if (process.env.NEXT_PUBLIC_DEMO_ENABLED !== '1') {
    return { error: 'Demo is not available.' };
  }
  const supabase = await createClient();
  const { error: anonErr } = await supabase.auth.signInAnonymously();
  if (anonErr) return { error: 'Demo is unavailable right now.' };
  const { error: joinErr } = await supabase.rpc('join_demo_org');
  if (joinErr) {
    await supabase.auth.signOut();
    return { error: 'Demo is unavailable right now.' };
  }
  redirect('/command');
}
