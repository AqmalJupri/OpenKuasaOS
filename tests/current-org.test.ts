import { expect, test, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getCurrentOrg, requireOrg } from '@/lib/auth/current-org';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

type Row = { user_id: string; org_id: string; role: string };

function fakeClient(
  user: { id: string } | null,
  rows: Row[],
  queryError: Error | null = null,
) {
  return {
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from: () => {
      let filter: ((r: Row) => boolean) | null = null;
      const builder = {
        select: () => builder,
        eq: (col: string, val: string) => {
          filter = (r) => (r as Record<string, string>)[col] === val;
          return builder;
        },
        order: () => builder,
        limit: () => builder,
        maybeSingle: async () => {
          if (queryError) return { data: null, error: queryError };
          const match = rows.filter((r) => (filter ? filter(r) : true))[0];
          return { data: match ? { org_id: match.org_id, role: match.role } : null, error: null };
        },
      };
      return builder;
    },
  } as unknown as SupabaseClient;
}

test('returns null when not signed in', async () => {
  expect(await getCurrentOrg(fakeClient(null, []))).toBeNull();
});

test('returns null when signed in but org-less', async () => {
  expect(await getCurrentOrg(fakeClient({ id: 'u1' }, []))).toBeNull();
});

test('returns orgId + role for a member', async () => {
  const rows = [{ user_id: 'u1', org_id: 'o1', role: 'owner' }];
  expect(await getCurrentOrg(fakeClient({ id: 'u1' }, rows))).toEqual({ orgId: 'o1', role: 'owner' });
});

test("returns the caller's own row, not another member's", async () => {
  const rows = [
    { user_id: 'owner1', org_id: 'o1', role: 'owner' },
    { user_id: 'u2', org_id: 'o1', role: 'viewer' },
  ];
  expect(await getCurrentOrg(fakeClient({ id: 'u2' }, rows))).toEqual({ orgId: 'o1', role: 'viewer' });
});

test('throws on query error instead of reporting org-less', async () => {
  const boom = new Error('db down');
  await expect(getCurrentOrg(fakeClient({ id: 'u1' }, [], boom))).rejects.toBe(boom);
});

test('requireOrg redirects to /onboarding when org-less', async () => {
  await expect(requireOrg(fakeClient({ id: 'u1' }, []))).rejects.toThrow('REDIRECT:/onboarding');
});

test('requireOrg returns the org for a member', async () => {
  const rows = [{ user_id: 'u1', org_id: 'o1', role: 'admin' }];
  expect(await requireOrg(fakeClient({ id: 'u1' }, rows))).toEqual({ orgId: 'o1', role: 'admin' });
});
