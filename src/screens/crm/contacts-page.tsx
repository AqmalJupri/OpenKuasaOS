import ContactsScreen from '@/screens/reach/contacts';
import { requireOrg } from '@/lib/auth/current-org';
import { hasSupabaseEnv } from '@/lib/auth/viewer';
import { listCrmContacts } from '@/lib/crm/contacts';
import { createClient } from '@/lib/supabase/server';

export default async function CrmContactsPage() {
  // No project configured (dev / preview / tests): the sample view.
  if (!hasSupabaseEnv()) return <ContactsScreen />;

  const supabase = await createClient();
  const { orgId } = await requireOrg(supabase);

  let live: Awaited<ReturnType<typeof listCrmContacts>> | null = null;
  try {
    live = await listCrmContacts(supabase, orgId, 20);
  } catch (error) {
    // The CRM migration is applied to a database separately from a deploy, so
    // the table can be missing for a while. Keep the page up meanwhile.
    console.error('[crm/contacts] could not load contacts', error);
  }

  if (!live) return <ContactsScreen />;
  return <ContactsScreen contacts={live.contacts} totalContacts={live.total} />;
}
