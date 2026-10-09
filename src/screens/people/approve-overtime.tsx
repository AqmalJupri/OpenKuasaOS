import { Clock, Download, Layers, Timer, TrendingUp } from 'lucide-react';
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
const SPARK_PENDING = [5, 4, 6, 3, 5, 4, 5, 4];
const SPARK_APPROVED = [58, 63, 61, 70, 74, 79, 83, 86];
const SPARK_REJECTED = [0, 1, 0, 1, 2, 1, 0, 1];
const SPARK_TURNAROUND = [0.9, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.6];

/* Overtime hours over time (last 8 weeks) */
const HOURS_TREND = [
  { label: 'Wk1', submitted: 18, approved: 15 },
  { label: 'Wk2', submitted: 22, approved: 19 },
  { label: 'Wk3', submitted: 16, approved: 14 },
  { label: 'Wk4', submitted: 26, approved: 23 },
  { label: 'Wk5', submitted: 21, approved: 18 },
  { label: 'Wk6', submitted: 24, approved: 21 },
  { label: 'Wk7', submitted: 19, approved: 17 },
  { label: 'Wk8', submitted: 23, approved: 20 },
];
const HOURS_SERIES: Series[] = [
  { key: 'submitted', label: 'Submitted (hrs)', color: 'var(--chart-1)' },
  { key: 'approved', label: 'Approved (hrs)', color: 'var(--chart-2)' },
];

/* Pending OT hours by department */
const BY_DEPT = [
  { label: 'Ops', hours: 14 },
  { label: 'Sales', hours: 8 },
  { label: 'Finance', hours: 5 },
  { label: 'Marketing', hours: 3 },
];

type Row = {
  id: string;
  employee: string;
  date: string;
  hours: number;
  amount: string;
  status: Status;
};

const ROWS: Row[] = [
  { id: '1', employee: 'Ahmad Zaki', date: '05 Oct', hours: 4, amount: 'RM 200', status: 'Pending' },
  { id: '2', employee: 'Lim Wei Jie', date: '04 Oct', hours: 2, amount: 'RM 80', status: 'Pending' },
  { id: '3', employee: 'Faiz Hakim', date: '03 Oct', hours: 3, amount: 'RM 120', status: 'Pending' },
  { id: '4', employee: 'Hafiz Omar', date: '06 Oct', hours: 5, amount: 'RM 250', status: 'Pending' },
  { id: '5', employee: 'Aisyah Rahim', date: '01 Oct', hours: 2, amount: 'RM 80', status: 'Approved' },
  { id: '6', employee: 'Nurul Huda', date: '28 Sep', hours: 3, amount: 'RM 120', status: 'Approved' },
  { id: '7', employee: 'Wan Azlan', date: '25 Sep', hours: 2, amount: 'RM 80', status: 'Rejected' },
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

function DeptBreakdown() {
  const max = Math.max(...BY_DEPT.map((d) => d.hours));
  return (
    <ul className="space-y-3">
      {BY_DEPT.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{d.label}</span>
            <span className="tabular-nums text-muted-foreground">{d.hours} hrs</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(d.hours / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ApproveOvertimeScreen() {
  const pending = ROWS.filter((r) => r.status === 'Pending').length;
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Overtime Approvals"
        subtitle="Pending overtime claims from your team, Saudara."
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
            delta="14 hrs"
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
            label="Approved (MTD)"
            value="86 hrs"
            delta="+9%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_APPROVED} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Rejected"
            value="1"
            delta="2 hrs"
            deltaTone="down"
            chart={<Sparkline data={SPARK_REJECTED} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg turnaround"
            value="0.6d"
            delta="−0.1d"
            deltaTone="up"
            chart={<Sparkline data={SPARK_TURNAROUND} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>

        {/* One chart + breakdown */}
        <BentoCard
          title="Overtime hours over time"
          subtitle="Submitted vs approved · last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend
            data={HOURS_TREND}
            series={HOURS_SERIES}
            height={220}
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="Pending by department"
          subtitle="Current queue (hrs)"
          icon={Layers}
          className="col-span-2 md:col-span-4"
        >
          <DeptBreakdown />
        </BentoCard>

        {/* Requests table */}
        <BentoCard
          title="Overtime claims"
          subtitle="Most recent first"
          icon={Timer}
          action={
            <Button variant="outline" size="sm">
              <Clock className="size-4" />
              Timesheets
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
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Amount (RM)</TableHead>
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
                    <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {r.hours}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {r.amount}
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
