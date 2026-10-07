import { PlaceholderPage } from '@/components/app/placeholder-page';
import { MODULES } from '@/config/modules';

const m = MODULES.find((x) => x.key === 'crm')!;

export default function CrmPage() {
  return <PlaceholderPage title={m.name} subtitle={m.tagline} icon={m.icon} />;
}
