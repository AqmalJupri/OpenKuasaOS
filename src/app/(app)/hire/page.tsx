import { PlaceholderPage } from '@/components/app/placeholder-page';
import { MODULES } from '@/config/modules';

const m = MODULES.find((x) => x.key === 'hire')!;

export default function HirePage() {
  return <PlaceholderPage title={m.name} subtitle={m.tagline} icon={m.icon} />;
}
