import { hasSupabaseEnv } from '@/lib/auth/viewer';
import { requireOrg } from '@/lib/auth/current-org';
import { listCrmDeals } from '@/lib/crm/deals';
import { createClient } from '@/lib/supabase/server';
import DealsScreen from './deals';

export default async function CrmDealsPage() {
  if (!hasSupabaseEnv()) return <DealsScreen />;

  const supabase = await createClient();
  const { orgId } = await requireOrg(supabase);

  let board: Awaited<ReturnType<typeof listCrmDeals>> | null = null;
  try {
    board = await listCrmDeals(supabase, orgId);
  } catch (error) {
    // Keep previews and staggered DB deploys alive if the CRM table is not ready.
    console.error('[crm/deals] could not load deals', error);
  }

  if (!board) return <DealsScreen />;
  return (
    <DealsScreen
      stages={board.stages}
      totalDeals={board.totalDeals}
      pipelineValue={board.pipelineValue}
    />
  );
}
