import { CalendarClock, Download, Layers, ListChecks, TrendingUp } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { AreaTrend, Sparkline, type Series } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type Status = 'Pending' | 'Approved' | 'Rejected';

const STATUS_STYLE: Record<Status, string> = {
  Approved: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Rejected: 'bg-red-500/15 text-red-600',
};

/* KPI sparkline trends */
const SPARK_PENDING = [8, 6, 7, 5, 6, 4, 6, 5];
const SPARK_APPROVED = [14, 16, 15, 18, 19, 21, 22, 23];
const SPARK_REJECTED = [1, 0, 2, 1, 1, 0, 1, 2];
const SPARK_TURNAROUND = [1.9, 1.8, 1.7, 1.6, 1.5, 1.5, 1.4, 1.4];

/* Leave requests over time (last 8 weeks) */
const REQUEST_TREND = [
  { label: 'Wk1', submitted: 9, approved: 7 },
  { label: 'Wk2', submitted: 11, approved: 9 },
  { label: 'Wk3', submitted: 8, approved: 7 },
  { label: 'Wk4', submitted: 13, approved: 11 },
  { label: 'Wk5', submitted: 10, approved: 9 },
  { label: 'Wk6', submitted: 12, approved: 10 },
  { label: 'Wk7', submitted: 9, approved: 8 },
  { label: 'Wk8', submitted: 11, approved: 10 },
];
const REQUEST_SERIES: Series[] = [
  { key: 'submitted', label: 'Submitted', color: 'var(--chart-1)' },
  { key: 'approved', label: 'Approved', color: 'var(--chart-2)' },
];

/* By leave type (pending book) */
const BY_TYPE = [
  { label: 'Annual', count: 11 },
  { label: 'Medical (MC)', count: 6 },
  { label: 'Emergency', count: 3 },
  { label: 'Unpaid', count: 2 },
];

type Row = {
  id: string;
  employee: string;
  type: string;
  range: string;
  days: number;
  status: Status;
};

const ROWS: Row[] = [
  { id: '1', employee: 'Aisyah Rahim', type: 'Annual', range: '13–14 Oct', days: 2, status: 'Pending' },
  { id: '2', employee: 'Faiz Hakim', type: 'Medical (MC)', range: '09 Oct', days: 1, status: 'Pending' },
  { id: '3', employee: 'Nurul Huda', type: 'Annual', range: '20–22 Oct', days: 3, status: 'Pending' },
  { id: '4', employee: 'Siti Aminah', type: 'Emergency', range: '06 Oct', days: 1, status: 'Pending' },
  { id: '5', employee: 'Hafiz Omar', type: 'Annual', range: '23 Oct', days: 1, status: 'Pending' },
  { id: '6', employee: 'Lim Wei Jie', type: 'Annual', range: '01 Oct', days: 1, status: 'Approved' },
  { id: '7', employee: 'Ahmad Zaki', type: 'Unpaid', range: '26–27 Sep', days: 2, status: 'Approved' },
  { id: '8', employee: 'Wan Azlan', type: 'Medical (MC)', range: '25 Sep', days: 1, status: 'Rejected' },
];

/* ------------------------------------------------------------------ */

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLE[status],
      )}
    >
      {status}
    </span>
  );
}

function EmployeeCell({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {name.charAt(0)}
      </span>
      <span className="whitespace-nowrap font-medium">{name}</span>
    </div>
  );
}

function ApprovalActions({ status }: { status: Status }) {
  if (status !== 'Pending')
    return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex gap-2">
      <Button size="sm">Approve</Button>
      <Button variant="outline" size="sm">
        Reject
      </Button>
    </div>
  );
}

function TypeBreakdown() {
  const max = Math.max(...BY_TYPE.map((t) => t.count));
  return (
    <ul className="space-y-3">
      {BY_TYPE.map((t) => (
        <li key={t.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{t.label}</span>
            <span className="tabular-nums text-muted-foreground">{t.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(t.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ApproveLeaveScreen() {
  const pending = ROWS.filter((r) => r.status === 'Pending').length;
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Leave Approvals"
        subtitle="Pending leave requests from your team, Saudara."
        actions={
          <>
            <Select defaultValue="30d">
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending"
            value={pending}
            delta="awaiting"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_PENDING}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Approved this month"
            value="23"
            delta="+4"
            deltaTone="up"
            chart={<Sparkline data={SPARK_APPROVED} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Rejected"
            value="2"
            delta="+1"
            deltaTone="down"
            chart={<Sparkline data={SPARK_REJECTED} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg turnaround"
            value="1.4d"
            delta="−0.3d"
            deltaTone="up"
            chart={<Sparkline data={SPARK_TURNAROUND} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>

        {/* One chart + breakdown */}
        <BentoCard
          title="Leave requests over time"
          subtitle="Submitted vs approved · last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend
            data={REQUEST_TREND}
            series={REQUEST_SERIES}
            height={220}
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="Pending by type"
          subtitle="Current queue"
          icon={Layers}
          className="col-span-2 md:col-span-4"
        >
          <TypeBreakdown />
        </BentoCard>

        {/* Requests table */}
        <BentoCard
          title="Leave requests"
          subtitle="Most recent first"
          icon={ListChecks}
          action={
            <Button variant="outline" size="sm">
              <CalendarClock className="size-4" />
              Calendar
            </Button>
          }
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From–To</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <EmployeeCell name={r.employee} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{r.type}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.range}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {r.days}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={r.status === 'Pending'} />
                        <StatusPill status={r.status} />
                      </span>
                    </TableCell>
                    <TableCell>
                      <ApprovalActions status={r.status} />
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
