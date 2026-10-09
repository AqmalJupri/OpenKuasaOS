import ContactsScreen from '@/screens/reach/contacts';
import { requireOrg } from '@/lib/auth/current-org';
import { listCrmContacts, type CrmContactsClient } from '@/lib/crm/contacts';
import { createClient } from '@/lib/supabase/server';

export default async function CrmContactsPage() {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!hasSupabaseEnv) return <ContactsScreen />;

  const supabase = await createClient();
  const { orgId } = await requireOrg(supabase);
  const { contacts, total } = await listCrmContacts(
    supabase as unknown as CrmContactsClient,
    orgId,
    20,
  );

  return <ContactsScreen contacts={contacts} totalContacts={total} />;
}
