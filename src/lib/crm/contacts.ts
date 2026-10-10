import type { SupabaseClient } from '@supabase/supabase-js';

export type CrmContact = {
  id: string;
  email: string;
  company: string;
  first: string;
  last: string;
  phone: string;
  country: string;
  status: string | null;
  score: number;
  pic: string | null;
  lastInteraction: string | null;
};

export type CrmContactsResult = {
  contacts: CrmContact[];
  total: number;
};

type CrmContactRow = {
  id: string;
  email: string | null;
  company: string | null;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  country: string | null;
  status: string;
  lead_score: number;
  owner_user_id: string | null;
  last_interaction_at: string | null;
};

/** Columns of `crm_contacts` the Contacts screen lists. */
const CONTACT_COLUMNS = [
  'id',
  'email',
  'company',
  'first_name',
  'last_name',
  'phone',
  'country',
  'status',
  'lead_score',
  'owner_user_id',
  'last_interaction_at',
].join(',');

/** Database status -> the label the screen shows. */
const STATUS_LABELS: Record<string, string> = {
  lead: 'New Leads',
  contacted: 'Contacted',
  qualified: 'Qualified',
  customer: 'Customer',
  archived: 'Archived',
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function mapCrmContact(row: CrmContactRow, ownerName: string | null = null): CrmContact {
  return {
    id: row.id,
    email: row.email ?? '',
    company: row.company ?? 'Personal',
    first: row.first_name,
    last: row.last_name ?? '',
    phone: row.phone ?? '',
    country: row.country ?? '—',
    status: STATUS_LABELS[row.status] ?? null,
    score: row.lead_score,
    pic: ownerName,
    lastInteraction: formatDate(row.last_interaction_at),
  };
}

/**
 * The person in charge is stored as `owner_user_id`; the name shown comes from
 * `profiles`. A name that cannot be read (no profile, or the lookup fails) is
 * shown as blank and never fails the page.
 */
async function ownerNames(client: SupabaseClient, rows: CrmContactRow[]) {
  const names = new Map<string, string>();
  const ids = [
    ...new Set(rows.map((r) => r.owner_user_id).filter((id): id is string => !!id)),
  ];
  if (ids.length === 0) return names;

  const { data, error } = await client
    .from('profiles')
    .select('user_id,full_name')
    .in('user_id', ids);
  if (error) return names;

  for (const p of (data ?? []) as { user_id: string; full_name: string | null }[]) {
    if (p.full_name) names.set(p.user_id, p.full_name);
  }
  return names;
}

export async function listCrmContacts(
  client: SupabaseClient,
  orgId: string,
  limit = 20,
): Promise<CrmContactsResult> {
  const { data, count, error } = await client
    .from('crm_contacts')
    .select(CONTACT_COLUMNS, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  const rows = (data ?? []) as unknown as CrmContactRow[];
  const names = await ownerNames(client, rows);

  return {
    contacts: rows.map((row) =>
      mapCrmContact(row, row.owner_user_id ? (names.get(row.owner_user_id) ?? null) : null),
    ),
    total: count ?? rows.length,
  };
}
