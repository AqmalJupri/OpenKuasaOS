import type { SupabaseClient } from '@supabase/supabase-js';

export type CrmDeal = {
  id: string;
  company: string;
  summary: string;
  value: number;
  owner: string;
  lastTouch: string;
  tag?: string;
};

export type CrmDealStage = {
  name: string;
  dot: string;
  deals: CrmDeal[];
};

export type CrmDealsBoard = {
  stages: CrmDealStage[];
  totalDeals: number;
  pipelineValue: number;
};

type CrmDealRow = {
  id: string;
  title: string | null;
  value_cents: number | null;
  currency: string | null;
  tag: string | null;
  status: string | null;
  last_activity_at: string | null;
  owner_user_id: string | null;
  crm_contacts:
    | {
        company: string | null;
        first_name: string | null;
        last_name: string | null;
      }
    | null;
  crm_pipeline_stages:
    | {
        id: string;
        name: string | null;
        position: number | null;
      }
    | null;
};

const STAGE_DOTS: Record<string, string> = {
  lead: 'bg-primary',
  qualified: 'bg-blue-500',
  proposal: 'bg-slate-500',
  negotiation: 'bg-amber-500',
  won: 'bg-emerald-500',
  lost: 'bg-red-500',
};

const DEAL_COLUMNS = `
  id,
  title,
  value_cents,
  currency,
  tag,
  status,
  last_activity_at,
  owner_user_id,
  crm_contacts(company, first_name, last_name),
  crm_pipeline_stages(id, name, position)
`;

function stageDot(name: string) {
  const key = name.toLowerCase().replace(/\s+/g, '_');
  return STAGE_DOTS[key] ?? 'bg-slate-500';
}

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function companyName(row: CrmDealRow) {
  const company = row.crm_contacts?.company?.trim();
  if (company) return company;

  const person = [row.crm_contacts?.first_name, row.crm_contacts?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  return person || 'Unknown contact';
}

function mapDeal(row: CrmDealRow): CrmDeal {
  const tag = row.tag?.trim();
  return {
    id: row.id,
    company: companyName(row),
    summary: row.title?.trim() || 'Untitled deal',
    value: Math.round((row.value_cents ?? 0) / 100),
    owner: 'Unassigned',
    lastTouch: formatDate(row.last_activity_at),
    ...(tag ? { tag } : {}),
  };
}

function stageName(row: CrmDealRow) {
  return row.crm_pipeline_stages?.name?.trim() || 'Unstaged';
}

function stagePosition(row: CrmDealRow) {
  return row.crm_pipeline_stages?.position ?? Number.MAX_SAFE_INTEGER;
}

export async function listCrmDeals(
  client: SupabaseClient,
  orgId: string,
): Promise<CrmDealsBoard> {
  const query = client.from('crm_deals');
  const result = await query
    .select(DEAL_COLUMNS)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (result.error) throw result.error;

  const rows = (Array.isArray(result.data) ? result.data : []) as unknown as CrmDealRow[];
  const grouped = new Map<
    string,
    { name: string; dot: string; position: number; deals: CrmDeal[] }
  >();

  for (const row of rows) {
    const name = stageName(row);
    const existing = grouped.get(name) ?? {
      name,
      dot: stageDot(name),
      position: stagePosition(row),
      deals: [],
    };
    existing.position = Math.min(existing.position, stagePosition(row));
    existing.deals.push(mapDeal(row));
    grouped.set(name, existing);
  }

  const stages = [...grouped.values()]
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
    .map((stage) => ({
      name: stage.name,
      dot: stage.dot,
      deals: stage.deals,
    }));

  return {
    stages,
    totalDeals: rows.length,
    pipelineValue: rows.reduce((sum, row) => sum + (row.value_cents ?? 0) / 100, 0),
  };
}
