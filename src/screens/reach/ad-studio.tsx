import { Coins, Megaphone, Plus, TrendingDown, Users } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type CampaignStatus = 'Active' | 'Paused' | 'Draft';

type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  spend: string;
  reach: string;
  leads: number;
  cpl: string;
};

const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Ramadan–Raya Promo',
    status: 'Active',
    spend: 'RM 1,200',
    reach: '48K',
    leads: 96,
    cpl: 'RM 12.50',
  },
  {
    id: '2',
    name: 'New Product Launch',
    status: 'Active',
    spend: 'RM 1,850',
    reach: '61K',
    leads: 70,
    cpl: 'RM 26.40',
  },
  {
    id: '3',
    name: 'Retargeting — Cart',
    status: 'Paused',
    spend: 'RM 640',
    reach: '12K',
    leads: 54,
    cpl: 'RM 11.85',
  },
  {
    id: '4',
    name: 'Brand Awareness',
    status: 'Draft',
    spend: 'RM 0',
    reach: '—',
    leads: 0,
    cpl: '—',
  },
];

const STATUS_STYLES: Record<CampaignStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Paused: 'bg-muted text-muted-foreground',
  Draft: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
};

function StatusPill({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function AdStudioScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Ad Studio"
        subtitle="Create and manage AI-powered ad campaigns."
        actions={
          <>
            <Button variant="outline" size="sm">
              Connect Meta
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              New Campaign
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8v2.8h2.7V21h2.8Z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Connect your Meta account</p>
            <p className="text-sm text-muted-foreground">
              Link Meta to launch ads and sync leads.
            </p>
          </div>
        </div>
        <Button size="sm" className="shrink-0 self-start sm:self-auto">
          Login with Facebook
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Campaigns"
          value={3}
          icon={Megaphone}
          tone="primary"
        />
        <StatCard
          label="Ad Spend"
          value="RM 4,280"
          note="This month"
          icon={Coins}
          tone="blue"
        />
        <StatCard label="Reach" value="128K" icon={Users} tone="violet" />
        <StatCard
          label="Cost / Lead"
          value="RM 6.10"
          icon={TrendingDown}
          tone="amber"
        />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Campaigns</h2>
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Reach</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>CPL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CAMPAIGNS.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {c.name}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={c.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {c.spend}
                    </TableCell>
                    <TableCell className="tabular-nums">{c.reach}</TableCell>
                    <TableCell className="tabular-nums">{c.leads}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {c.cpl}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </ScreenContainer>
  );
}
