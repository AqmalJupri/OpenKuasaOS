import { describe, expect, test, vi } from 'vitest';
import { listCrmContacts } from '@/lib/crm/contacts';

function createQuery(rows: unknown[], count: number | null, error: unknown = null) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(async () => ({ data: rows, count, error })),
  };
  return query;
}

describe('listCrmContacts', () => {
  test('reads contacts for one org and maps database rows to the screen model', async () => {
    const rows = [
      {
        id: 'contact-1',
        email: 'aisyah@example.com',
        company_name: 'Rimba Ventures Sdn Bhd',
        first_name: 'Aisyah',
        last_name: 'Rahim',
        phone: '+60123456789',
        country: 'MY',
        status: 'qualified',
        lead_score: 92,
        owner_name: 'Faiz',
        last_interaction_at: '2026-10-09T10:00:00.000Z',
      },
    ];
    const query = createQuery(rows, 8);
    const client = { from: vi.fn(() => query) };

    const result = await listCrmContacts(client, 'org-1', 25);

    expect(client.from).toHaveBeenCalledWith('crm_contacts');
    expect(query.select).toHaveBeenCalledWith(
      'id,email,company_name,first_name,last_name,phone,country,status,lead_score,owner_name,last_interaction_at',
      { count: 'exact' },
    );
    expect(query.eq).toHaveBeenCalledWith('org_id', 'org-1');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(query.limit).toHaveBeenCalledWith(25);
    expect(result).toEqual({
      total: 8,
      contacts: [
        {
          id: 'contact-1',
          email: 'aisyah@example.com',
          company: 'Rimba Ventures Sdn Bhd',
          first: 'Aisyah',
          last: 'Rahim',
          phone: '+60123456789',
          country: 'MY',
          status: 'Qualified',
          score: 92,
          pic: 'Faiz',
          lastInteraction: '9 Oct 2026',
        },
      ],
    });
  });

  test('returns an empty list when the org has no contacts', async () => {
    const query = createQuery([], 0);
    const client = { from: vi.fn(() => query) };

    await expect(listCrmContacts(client, 'org-2')).resolves.toEqual({
      total: 0,
      contacts: [],
    });
  });
});
