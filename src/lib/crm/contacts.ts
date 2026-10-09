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

export type CrmContactInsert = {
  org_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  company_name: string | null;
  country: string;
  status: string;
  lead_score: number;
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

export type CrmContactInsertClient = {
  from: (table: 'crm_contacts') => {
    insert: (payload: CrmContactInsert) => {
      select: (columns: string) => {
        single: () => PromiseLike<{
          data: unknown | null;
          error: unknown;
        }>;
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

const STATUSES = new Set(['new', 'contacted', 'qualified', 'customer']);

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function optionalString(value: string) {
  return value.length > 0 ? value : null;
}

function normalizeStatus(value: string) {
  const status = value.trim().toLowerCase().replaceAll(' ', '_');
  return STATUSES.has(status) ? status : 'new';
}

function normalizeScore(value: string) {
  if (!value) return 0;
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

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

export function parseCrmContactForm(
  formData: FormData,
  orgId: string,
): CrmContactInsert {
  const firstName = readString(formData, 'firstName');
  const lastName = readString(formData, 'lastName');
  const email = readString(formData, 'email').toLowerCase();
  const phone = readString(formData, 'phone');
  const company = readString(formData, 'company');
  const country = readString(formData, 'country').toUpperCase() || 'MY';
  const status = readString(formData, 'status');
  const leadScore = readString(formData, 'leadScore');

  if (!firstName) throw new Error('Enter a first name.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email.');

  return {
    org_id: orgId,
    first_name: firstName,
    last_name: optionalString(lastName),
    email,
    phone: optionalString(phone),
    company_name: optionalString(company),
    country,
    status: normalizeStatus(status),
    lead_score: normalizeScore(leadScore),
  };
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

export async function createCrmContact(
  client: CrmContactInsertClient,
  payload: CrmContactInsert,
): Promise<CrmContact> {
  const { data, error } = await client
    .from('crm_contacts')
    .insert(payload)
    .select(CONTACT_COLUMNS)
    .single();

  if (error) throw error;
  return mapCrmContact(data as CrmContactRow);
}
