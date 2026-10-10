import { describe, expect, test, vi } from 'vitest';
import { listCrmDeals } from '@/lib/crm/deals';

function createQuery(rows: unknown[], error: unknown = null) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(async () => ({ data: rows, error })),
  };
  return query;
}

describe('listCrmDeals', () => {
  test('reads org deals and groups them by stage for the board', async () => {
    const rows = [
      {
        id: 'deal-1',
        title: 'POS rollout',
        value_cents: 1800000,
        currency: 'MYR',
        tag: 'Inbound',
        status: 'open',
        last_activity_at: '2026-10-09T10:00:00.000Z',
        owner_user_id: null,
        crm_contacts: { company: 'Seri Mutiara Enterprise', first_name: 'Aisyah', last_name: 'Rahim' },
        crm_pipeline_stages: { id: 'stage-1', name: 'Lead', position: 1 },
      },
      {
        id: 'deal-2',
        title: 'Annual CRM retainer',
        value_cents: 3600000,
        currency: 'MYR',
        tag: null,
        status: 'open',
        last_activity_at: null,
        owner_user_id: null,
        crm_contacts: { company: 'Delima Properties', first_name: 'Nurul', last_name: 'Huda' },
        crm_pipeline_stages: { id: 'stage-2', name: 'Negotiation', position: 2 },
      },
    ];
    const query = createQuery(rows);
    const client = { from: vi.fn(() => query) };

    const result = await listCrmDeals(client as never, 'org-1');

    expect(client.from).toHaveBeenCalledWith('crm_deals');
    expect(query.eq).toHaveBeenCalledWith('org_id', 'org-1');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result.totalDeals).toBe(2);
    expect(result.pipelineValue).toBe(54000);
    expect(result.stages).toEqual([
      {
        name: 'Lead',
        dot: 'bg-primary',
        deals: [
          {
            id: 'deal-1',
            company: 'Seri Mutiara Enterprise',
            summary: 'POS rollout',
            value: 18000,
            owner: 'Unassigned',
            lastTouch: '9 Oct 2026',
            tag: 'Inbound',
          },
        ],
      },
      {
        name: 'Negotiation',
        dot: 'bg-amber-500',
        deals: [
          {
            id: 'deal-2',
            company: 'Delima Properties',
            summary: 'Annual CRM retainer',
            value: 36000,
            owner: 'Unassigned',
            lastTouch: '—',
          },
        ],
      },
    ]);
  });

  test('returns an empty board when no deals exist', async () => {
    const query = createQuery([]);
    const client = { from: vi.fn(() => query) };

    await expect(listCrmDeals(client as never, 'org-2')).resolves.toEqual({
      stages: [],
      totalDeals: 0,
      pipelineValue: 0,
    });
  });
});
