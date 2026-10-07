import { CheckCheck, MailOpen, MousePointerClick, Plus, Send } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Badge } from '@/components/ui/badge';
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

type BroadcastStatus = 'Sent' | 'Scheduled' | 'Draft';

type Broadcast = {
  name: string;
  channel: 'WhatsApp' | 'Email';
  audience: string;
  sent: string;
  delivered: string;
  opened: string;
  status: BroadcastStatus;
};

const COLUMNS = [
  'Broadcast',
  'Channel',
  'Audience',
  'Sent',
  'Delivered',
  'Opened',
  'Status',
];

const BROADCASTS: Broadcast[] = [
  {
    name: 'Raya Promo Blast',
    channel: 'WhatsApp',
    audience: 'All contacts',
    sent: '1,240',
    delivered: '98%',
    opened: '64%',
    status: 'Sent',
  },
  {
    name: 'Weekly Newsletter',
    channel: 'Email',
    audience: 'Subscribers',
    sent: '890',
    delivered: '97%',
    opened: '58%',
    status: 'Sent',
  },
  {
    name: 'Flash Sale',
    channel: 'WhatsApp',
    audience: 'New Leads',
    sent: '—',
    delivered: '—',
    opened: '—',
    status: 'Scheduled',
  },
  {
    name: 'Win-back offer',
    channel: 'Email',
    audience: 'Churned',
    sent: '—',
    delivered: '—',
    opened: '—',
    status: 'Draft',
  },
];

const STATUS_STYLES: Record<BroadcastStatus, string> = {
  Sent: 'bg-emerald-500/15 text-emerald-600',
  Scheduled: 'bg-blue-500/15 text-blue-600',
  Draft: 'bg-muted text-muted-foreground',
};

export default function BroadcastScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Broadcast"
        subtitle="Send WhatsApp & email blasts to your contacts."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Broadcast
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sent (30d)" value={3} icon={Send} tone="primary" />
        <StatCard label="Delivered" value="98%" icon={CheckCheck} tone="green" />
        <StatCard label="Opened" value="61%" icon={MailOpen} tone="blue" />
        <StatCard
          label="Clicked"
          value="12%"
          icon={MousePointerClick}
          tone="violet"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                {COLUMNS.map((c) => (
                  <TableHead key={c} className="whitespace-nowrap">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {BROADCASTS.map((b) => (
                <TableRow key={b.name}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {b.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{b.channel}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{b.audience}</TableCell>
                  <TableCell>{b.sent}</TableCell>
                  <TableCell>{b.delivered}</TableCell>
                  <TableCell>{b.opened}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        STATUS_STYLES[b.status],
                      )}
                    >
                      {b.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
