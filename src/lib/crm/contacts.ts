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
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  country: string | null;
  status: string | null;
  lead_score: number | null;
  owner_name: string | null;
  last_interaction_at: string | null;
};

export type CrmContactsClient = {
  from: (table: 'crm_contacts') => {
    select: (
      columns: string,
      options: { count: 'exact' },
    ) => {
      eq: (column: 'org_id', value: string) => {
        order: (
          column: 'created_at',
          options: { ascending: false },
        ) => {
          limit: (count: number) => PromiseLike<{
            data: unknown[] | null;
            count: number | null;
            error: unknown;
          }>;
        };
      };
    };
  };
};

const CONTACT_COLUMNS = [
  'id',
  'email',
  'company_name',
  'first_name',
  'last_name',
  'phone',
  'country',
  'status',
  'lead_score',
  'owner_name',
  'last_interaction_at',
].join(',');

function titleCase(value: string | null) {
  if (!value) return null;
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function mapCrmContact(row: CrmContactRow): CrmContact {
  return {
    id: row.id,
    email: row.email ?? '',
    company: row.company_name ?? 'Personal',
    first: row.first_name ?? '',
    last: row.last_name ?? '',
    phone: row.phone ?? '',
    country: row.country ?? 'MY',
    status: titleCase(row.status),
    score: row.lead_score ?? 0,
    pic: row.owner_name,
    lastInteraction: formatDate(row.last_interaction_at),
  };
}

export async function listCrmContacts(
  client: CrmContactsClient,
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

  return {
    contacts: ((data ?? []) as unknown as CrmContactRow[]).map(mapCrmContact),
    total: count ?? data?.length ?? 0,
  };
}
