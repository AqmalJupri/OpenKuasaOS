import { BarChart3, ClipboardList, Clock, Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { BarGroup, Sparkline, type Series } from '@/components/charts';
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

/* OT hours logged per month. */
const OT_BY_MONTH = [
  { label: 'Apr', hours: 6 },
  { label: 'May', hours: 8 },
  { label: 'Jun', hours: 10 },
  { label: 'Jul', hours: 7 },
  { label: 'Aug', hours: 9 },
  { label: 'Sep', hours: 14 },
  { label: 'Oct', hours: 12 },
];
const OT_SERIES: Series[] = [{ key: 'hours', label: 'OT hours', color: 'var(--chart-1)' }];

/* OT split by EA 1955 multiplier. */
const RATE_ROWS = [
  { label: 'Normal day (1.5x)', hours: '8h', amount: 'RM 320' },
  { label: 'Rest day (2.0x)', hours: '6h', amount: 'RM 310' },
  { label: 'Public holiday (3.0x)', hours: '5h', amount: 'RM 420' },
];

const COLUMNS = ['Date', 'Hours', 'Rate', 'Amount', 'Status'];

const CLAIMS: {
  id: string;
  date: string;
  hours: number;
  rate: string;
  amount: string;
  status: Status;
}[] = [
  { id: 'OT-1005', date: '05 Oct', hours: 4, rate: '2.0x', amount: 'RM 200', status: 'Pending' },
  { id: 'OT-1004', date: '04 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Approved' },
  { id: 'OT-1002', date: '02 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
  { id: 'OT-1001', date: '01 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
  { id: 'OT-0916', date: '16 Sep', hours: 5, rate: '3.0x', amount: 'RM 420', status: 'Approved' },
  { id: 'OT-0921', date: '21 Sep', hours: 2, rate: '2.0x', amount: 'RM 110', status: 'Rejected' },
];

export default function OtClaimsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="OT Claims"
        subtitle="Claim your overtime hours, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Claim OT
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="OT hours (MTD)"
            value="12"
            delta="hours"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline
                data={[6, 8, 10, 7, 9, 14, 12]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="OT pay (MTD)"
            value="RM 520"
            delta="+14%"
            deltaTone="up"
            chart={
              <Sparkline data={[260, 340, 420, 300, 380, 560, 520]} color="var(--chart-2)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending"
            value="4"
            delta="hours"
            deltaTone="flat"
            chart={
              <Sparkline data={[2, 0, 3, 1, 2, 4, 4]} color="var(--chart-4)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Approved"
            value="8"
            delta="hours MTD"
            deltaTone="up"
            chart={
              <Sparkline data={[4, 6, 7, 6, 7, 10, 8]} color="var(--chart-1)" height={36} />
            }
          />
        </BentoCard>

        {/* OT by month bars + rate breakdown */}
        <BentoCard
          title="OT by month"
          subtitle="Hours logged · cap 104 h/month"
          icon={BarChart3}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup data={OT_BY_MONTH} series={OT_SERIES} height={230} />
        </BentoCard>
        <BentoCard
          title="By rate"
          subtitle="Per EA 1955 multipliers"
          icon={Clock}
          className="col-span-2 md:col-span-4"
        >
          <ul className="divide-y">
            {RATE_ROWS.map((r) => (
              <li key={r.label} className="flex items-center gap-3 py-3">
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{r.hours}</span>
                <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums">
                  {r.amount}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* OT claims table */}
        <BentoCard
          title="My Requests"
          subtitle="Overtime claims and their status"
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
                {CLAIMS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap font-medium">{r.date}</TableCell>
                    <TableCell className="tabular-nums">{r.hours}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.rate}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{r.amount}</TableCell>
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
