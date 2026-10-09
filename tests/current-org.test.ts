import { expect, test } from 'vitest';
import { getCurrentOrg } from '@/lib/auth/current-org';

function fakeClient(user: { id: string } | null, membership: { org_id: string; role: string } | null) {
  return {
    auth: { getUser: async () => ({ data: { user }, error: null }) },
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({ maybeSingle: async () => ({ data: membership, error: null }) }),
        }),
      }),
    }),
  } as any;
}

test('returns null when not signed in', async () => {
  expect(await getCurrentOrg(fakeClient(null, null))).toBeNull();
});

test('returns null when signed in but org-less', async () => {
  expect(await getCurrentOrg(fakeClient({ id: 'u1' }, null))).toBeNull();
});

test('returns orgId + role for a member', async () => {
  expect(await getCurrentOrg(fakeClient({ id: 'u1' }, { org_id: 'o1', role: 'owner' }))).toEqual({
    orgId: 'o1',
    role: 'owner',
  });
});
