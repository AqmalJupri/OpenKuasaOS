import { ClipboardList, ListChecks, PieChart, Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, Sparkline, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
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

/* ---- mock data (Rimba Ventures Sdn Bhd · Saudara) ------------------ */

type Status = 'Approved' | 'Pending' | 'Rejected';

const STATUS_STYLES: Record<Status, string> = {
  Approved: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Rejected: 'bg-red-500/15 text-red-600',
};

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

/* Time-off this month, by reason (hours) — center totals to 6.5h. */
const REASON_MIX: Slice[] = [
  { key: 'clinic', label: 'Clinic', value: 2.0, color: 'var(--chart-1)' },
  { key: 'bank', label: 'Bank', value: 2.0, color: 'var(--chart-2)' },
  { key: 'personal', label: 'Personal', value: 1.5, color: 'var(--chart-3)' },
  { key: 'errands', label: 'Errands', value: 1.0, color: 'var(--chart-4)' },
];

const REASON_ROWS = [
  { label: 'Clinic', hours: '2.0h', requests: 1 },
  { label: 'Bank', hours: '2.0h', requests: 1 },
  { label: 'Personal', hours: '1.5h', requests: 1 },
  { label: 'Errands (JPJ)', hours: '1.0h', requests: 1 },
];

const COLUMNS = ['Date', 'From', 'To', 'Duration', 'Reason', 'Status'];

const REQUESTS: {
  id: string;
  date: string;
  from: string;
  to: string;
  duration: string;
  reason: string;
  status: Status;
}[] = [
  { id: 'TO-0310', date: '10 Oct', from: '15:00', to: '16:30', duration: '1.5h', reason: 'Personal', status: 'Pending' },
  { id: 'TO-0303', date: '03 Oct', from: '14:00', to: '16:00', duration: '2h', reason: 'Clinic', status: 'Approved' },
  { id: 'TO-0928', date: '28 Sep', from: '09:00', to: '11:00', duration: '2h', reason: 'Bank', status: 'Approved' },
  { id: 'TO-0919', date: '19 Sep', from: '10:00', to: '11:00', duration: '1h', reason: 'JPJ renewal', status: 'Rejected' },
  { id: 'TO-0912', date: '12 Sep', from: '16:00', to: '17:00', duration: '1h', reason: 'Errands', status: 'Approved' },
  { id: 'TO-0905', date: '05 Sep', from: '08:30', to: '10:00', duration: '1.5h', reason: 'Clinic', status: 'Approved' },
];

export default function TimeOffScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Time-Off"
        subtitle="Short-duration time-off requests for your day, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Request Time-Off
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="This month"
            value="3"
            delta="requests"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline
                data={[1, 2, 1, 3, 2, 2, 3, 3]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Approved"
            value="2"
            delta="this month"
            deltaTone="up"
            chart={
              <Sparkline data={[1, 1, 1, 2, 1, 2, 2, 2]} color="var(--chart-2)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending"
            value="1"
            delta="request"
            deltaTone="flat"
            chart={
              <Sparkline data={[0, 1, 0, 1, 1, 0, 1, 1]} color="var(--chart-4)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Hours"
            value="6.5"
            delta="this month"
            deltaTone="flat"
            chart={
              <Sparkline data={[2, 4, 3, 5, 6, 5, 6, 6.5]} color="var(--chart-1)" height={36} />
            }
          />
        </BentoCard>

        {/* Reason donut + breakdown */}
        <BentoCard
          title="Time-off by reason"
          subtitle="This month · hours"
          icon={PieChart}
          className="col-span-2 md:col-span-5"
        >
          <DonutStat
            data={REASON_MIX}
            height={230}
            centerValue="6.5h"
            centerLabel="this month"
          />
        </BentoCard>
        <BentoCard
          title="By reason"
          subtitle="Where your hours went"
          icon={ListChecks}
          className="col-span-2 md:col-span-7"
        >
          <ul className="divide-y">
            {REASON_ROWS.map((r) => (
              <li key={r.label} className="flex items-center gap-3 py-3">
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {r.requests} {r.requests === 1 ? 'request' : 'requests'}
                </span>
                <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums">
                  {r.hours}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Requests table */}
        <BentoCard
          title="My Requests"
          subtitle="Time-off requests and their status"
          icon={ClipboardList}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="mt-3 overflow-x-auto">
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
                {REQUESTS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap font-medium">{r.date}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.from}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.to}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.duration}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {r.reason}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={r.status === 'Pending'} />
                        <StatusPill status={r.status} />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
