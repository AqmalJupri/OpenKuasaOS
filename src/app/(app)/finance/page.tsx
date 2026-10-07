import { PlaceholderPage } from '@/components/app/placeholder-page';
import { MODULES } from '@/config/modules';

const m = MODULES.find((x) => x.key === 'finance')!;

export default function FinancePage() {
  return <PlaceholderPage title={m.name} subtitle={m.tagline} icon={m.icon} />;
}
