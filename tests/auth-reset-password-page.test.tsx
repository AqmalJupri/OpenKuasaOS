import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * `/reset-password` on an install with no Supabase project: the page must say
 * there is nothing to reset instead of throwing while it renders.
 */

const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(async (): Promise<unknown> => {
    throw new Error(
      "Your project's URL and Key are required to create a Supabase client!",
    );
  }),
}));

vi.mock('@/lib/supabase/server', () => ({ createClient }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT ${path}`);
  },
}));

import ResetPasswordPage from '@/app/(auth)/reset-password/page';

function signedIn(user: { id: string } | null) {
  createClient.mockResolvedValue({
    auth: { getUser: async () => ({ data: { user } }) },
  });
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
});

describe('the password reset page without a project', () => {
  it('says the install is not connected instead of asking for a client', async () => {
    const html = renderToStaticMarkup(await ResetPasswordPage());

    expect(createClient).not.toHaveBeenCalled();
    expect(html).toContain('This install is not connected');
    expect(html).toContain(
      'cannot access accounts until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
    // Missing variables prove this deployment is not connected to Supabase.
    // They do not prove the project has no accounts.
    expect(html).not.toMatch(/no accounts/i);
    expect(html).not.toContain('Choose a strong password');
  });

  it('still asks Supabase for the recovery session when a project is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');
    signedIn(null);

    await expect(ResetPasswordPage()).rejects.toThrow(
      'REDIRECT /login?notice=reset_expired',
    );
    expect(createClient).toHaveBeenCalled();
  });
});
