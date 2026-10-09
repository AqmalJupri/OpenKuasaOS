import { Download, Layers, Receipt, TrendingUp, Wallet } from 'lucide-react';
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
const SPARK_PENDING = [6, 5, 7, 4, 6, 5, 6, 5];
const SPARK_APPROVED = [3.2, 3.8, 4.1, 4.6, 5.3, 5.8, 6.1, 6.4];
const SPARK_REJECTED = [1, 0, 1, 2, 1, 1, 0, 2];
const SPARK_TURNAROUND = [1.4, 1.3, 1.2, 1.1, 1.0, 1.0, 0.9, 0.9];

/* Claim value over time (RM k, last 8 weeks) */
const VALUE_TREND = [
  { label: 'Wk1', submitted: 1.8, approved: 1.5 },
  { label: 'Wk2', submitted: 2.3, approved: 2.0 },
  { label: 'Wk3', submitted: 1.6, approved: 1.4 },
  { label: 'Wk4', submitted: 2.9, approved: 2.5 },
  { label: 'Wk5', submitted: 2.2, approved: 1.9 },
  { label: 'Wk6', submitted: 2.6, approved: 2.3 },
  { label: 'Wk7', submitted: 1.9, approved: 1.7 },
  { label: 'Wk8', submitted: 2.4, approved: 2.1 },
];
const VALUE_SERIES: Series[] = [
  { key: 'submitted', label: 'Submitted (RM k)', color: 'var(--chart-1)' },
  { key: 'approved', label: 'Approved (RM k)', color: 'var(--chart-2)' },
];

/* Pending claim value by category (RM) */
const BY_CATEGORY = [
  { label: 'Travel', amount: 520, display: 'RM 520' },
  { label: 'Equipment', amount: 260, display: 'RM 260' },
  { label: 'Meals', amount: 90, display: 'RM 90' },
  { label: 'Parking', amount: 20, display: 'RM 20' },
];

type Row = {
  id: string;
  employee: string;
  category: string;
  amount: string;
  date: string;
  status: Status;
};

const ROWS: Row[] = [
  { id: '1', employee: 'Aisyah Rahim', category: 'Travel', amount: 'RM 180', date: '02 Oct', status: 'Pending' },
  { id: '2', employee: 'Faiz Hakim', category: 'Equipment', amount: 'RM 260', date: '05 Oct', status: 'Pending' },
  { id: '3', employee: 'Ahmad Zaki', category: 'Meals', amount: 'RM 90', date: '04 Oct', status: 'Pending' },
  { id: '4', employee: 'Nurul Huda', category: 'Parking', amount: 'RM 20', date: '01 Oct', status: 'Pending' },
  { id: '5', employee: 'Hafiz Omar', category: 'Travel', amount: 'RM 340', date: '06 Oct', status: 'Pending' },
  { id: '6', employee: 'Siti Aminah', category: 'Travel', amount: 'RM 150', date: '28 Sep', status: 'Approved' },
  { id: '7', employee: 'Lim Wei Jie', category: 'Equipment', amount: 'RM 480', date: '25 Sep', status: 'Approved' },
  { id: '8', employee: 'Wan Azlan', category: 'Meals', amount: 'RM 120', date: '22 Sep', status: 'Rejected' },
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

function CategoryBreakdown() {
  const max = Math.max(...BY_CATEGORY.map((c) => c.amount));
  return (
    <ul className="space-y-3">
      {BY_CATEGORY.map((c) => (
        <li key={c.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{c.label}</span>
            <span className="tabular-nums text-muted-foreground">{c.display}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(c.amount / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ApproveClaimsScreen() {
  const pending = ROWS.filter((r) => r.status === 'Pending').length;
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Claim Approvals"
        subtitle="Pending expense claims awaiting your sign-off, Saudara."
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
            delta="RM 890"
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
            value="RM 6,420"
            delta="+12%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_APPROVED} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Rejected"
            value="2"
            delta="RM 240"
            deltaTone="down"
            chart={<Sparkline data={SPARK_REJECTED} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg turnaround"
            value="0.9d"
            delta="−0.2d"
            deltaTone="up"
            chart={<Sparkline data={SPARK_TURNAROUND} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>

        {/* One chart + breakdown */}
        <BentoCard
          title="Claim value over time"
          subtitle="Submitted vs approved · last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend
            data={VALUE_TREND}
            series={VALUE_SERIES}
            height={220}
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="Pending by category"
          subtitle="Current queue (RM)"
          icon={Layers}
          className="col-span-2 md:col-span-4"
        >
          <CategoryBreakdown />
        </BentoCard>

        {/* Requests table */}
        <BentoCard
          title="Expense claims"
          subtitle="Most recent first"
          icon={Receipt}
          action={
            <Button variant="outline" size="sm">
              <Wallet className="size-4" />
              Batch pay
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
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount (RM)</TableHead>
                  <TableHead>Date</TableHead>
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
                    <TableCell className="whitespace-nowrap">{r.category}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {r.amount}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{r.date}</TableCell>
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
