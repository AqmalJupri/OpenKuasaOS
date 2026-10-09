import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';

type Integration = {
  name: string;
  category: string;
  connected: boolean;
  description: string;
};

const INTEGRATIONS: Integration[] = [
  {
    name: 'WhatsApp Business',
    category: 'Messaging',
    connected: true,
    description: 'Reply to leads and broadcast on WhatsApp.',
  },
  {
    name: 'Stripe',
    category: 'Payments',
    connected: true,
    description: 'Collect card payments on invoices.',
  },
  {
    name: 'Billplz',
    category: 'Payments',
    connected: false,
    description: 'FPX and online banking collections.',
  },
  {
    name: 'Meta',
    category: 'Social',
    connected: true,
    description: 'Sync leads from Facebook & Instagram pages.',
  },
  {
    name: 'Google Calendar',
    category: 'Scheduling',
    connected: false,
    description: 'Two-way sync for follow-up meetings.',
  },
  {
    name: 'Mailchimp',
    category: 'Email',
    connected: false,
    description: 'Sync audiences and newsletters.',
  },
  {
    name: 'Zapier',
    category: 'Automation',
    connected: true,
    description: 'Connect 5,000+ apps to your pipeline.',
  },
  {
    name: 'Xero',
    category: 'Accounting',
    connected: false,
    description: 'Push paid invoices to your ledger.',
  },
  {
    name: 'Slack',
    category: 'Messaging',
    connected: false,
    description: 'Deal-won alerts in your channels.',
  },
  {
    name: 'Shopify',
    category: 'E-commerce',
    connected: false,
    description: 'Import orders and customers.',
  },
  {
    name: 'Telegram',
    category: 'Messaging',
    connected: false,
    description: 'Reply to conversations on Telegram.',
  },
  {
    name: 'LHDN MyInvois',
    category: 'Compliance',
    connected: true,
    description: 'Submit e-invoices to LHDN.',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const { name, category, connected, description } = integration;
  return (
    <BentoCard className="col-span-2 md:col-span-3">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary transition-transform duration-300 group-hover/bento:scale-110 motion-reduce:transform-none">
            {initials(name)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <LiveDot active={connected} />
            {connected ? 'Connected' : 'Not connected'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{category}</p>
        </div>
        <p className="flex-1 text-sm text-muted-foreground">{description}</p>
        <Button
          variant={connected ? 'outline' : 'default'}
          size="sm"
          className="w-full"
        >
          {connected ? 'Manage' : 'Connect'}
        </Button>
      </div>
    </BentoCard>
  );
}

export default function PluginsScreen() {
  const connected = INTEGRATIONS.filter((i) => i.connected).length;
  const categories = new Set(INTEGRATIONS.map((i) => i.category)).size;

  return (
    <ScreenContainer>
      <PageHeader
        title="Plugins"
        subtitle="Connect OpenKuasa CRM to the tools you already use, Saudara."
      />

      <BentoGrid>
        {/* KPI strip */}
        <BentoCard tone="primary" className="col-span-2 md:col-span-4">
          <BentoStat label="Connected" value={connected} delta="Active" onPrimary />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-4">
          <BentoStat
            label="Available"
            value={INTEGRATIONS.length}
            delta="Marketplace"
            deltaTone="flat"
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-4">
          <BentoStat
            label="Categories"
            value={categories}
            delta="Coverage"
            deltaTone="flat"
          />
        </BentoCard>

        {/* Integration marketplace */}
        {INTEGRATIONS.map((integration) => (
          <IntegrationCard key={integration.name} integration={integration} />
        ))}
      </BentoGrid>
    </ScreenContainer>
  );
}
