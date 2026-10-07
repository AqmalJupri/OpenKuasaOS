import { Settings } from 'lucide-react';
import { PlaceholderPage } from '@/components/app/placeholder-page';

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      subtitle="Workspace, billing, security & integrations"
      icon={Settings}
    />
  );
}
