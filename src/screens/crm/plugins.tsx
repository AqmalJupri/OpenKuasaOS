import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Plugin = {
  name: string;
  category: string;
  connected: boolean;
  description: string;
};

const PLUGINS: Plugin[] = [
  { name: 'WhatsApp Business', category: 'Messaging', connected: true, description: 'Reply and broadcast on WhatsApp' },
  { name: 'Stripe', category: 'Payments', connected: true, description: 'Collect card payments' },
  { name: 'Meta Ads', category: 'Advertising', connected: true, description: 'Sync leads from Facebook & IG ads' },
  { name: 'Google Calendar', category: 'Scheduling', connected: false, description: 'Two-way calendar sync' },
  { name: 'Shopify', category: 'E-commerce', connected: false, description: 'Import orders & customers' },
  { name: 'Mailchimp', category: 'Email', connected: false, description: 'Sync audiences & campaigns' },
  { name: 'Zapier', category: 'Automation', connected: true, description: 'Connect 5,000+ apps' },
  { name: 'Telegram', category: 'Messaging', connected: false, description: 'Reply on Telegram' },
  { name: 'LHDN MyInvois', category: 'Compliance', connected: true, description: 'Submit e-invoices to LHDN' },
];

export default function PluginsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Plugins"
        subtitle="Connect OpenKuasa to the tools you already use."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLUGINS.map((plugin) => (
          <div key={plugin.name} className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="grid size-10 place-items-center rounded-xl bg-muted text-sm font-bold text-foreground">
                {plugin.name.charAt(0)}
              </div>
              <span
                className={cn(
                  'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                  plugin.connected
                    ? 'bg-emerald-500/15 text-emerald-600'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {plugin.connected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <div>
              <p className="font-semibold">{plugin.name}</p>
              <p className="text-xs text-muted-foreground">{plugin.category}</p>
            </div>
            <p className="text-sm text-muted-foreground">{plugin.description}</p>
            <Button variant="outline" size="sm" className="w-full">
              {plugin.connected ? 'Manage' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
