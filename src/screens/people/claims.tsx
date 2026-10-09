import { PieChart, Plus, Receipt, Wallet } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, Sparkline, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

const TOTAL_CLAIMED = 1240;

/* Claimed this month, by category (RM) — sums to RM 1,240. */
const CATEGORY_MIX: Slice[] = [
  { key: 'travel', label: 'Travel', value: 420, color: 'var(--chart-1)' },
  { key: 'meals', label: 'Meals', value: 240, color: 'var(--chart-2)' },
  { key: 'equipment', label: 'Equipment', value: 260, color: 'var(--chart-3)' },
  { key: 'accommodation', label: 'Accommodation', value: 260, color: 'var(--chart-5)' },
  { key: 'parking', label: 'Parking', value: 60, color: 'var(--chart-4)' },
];

const COLUMNS = ['Category', 'Amount', 'Date', 'Receipt', 'Status'];

const CLAIMS: {
  id: string;
  category: string;
  amount: string;
  date: string;
  receipt: boolean;
  status: Status;
}[] = [
  { id: 'CLM-0423', category: 'Equipment', amount: 'RM 260', date: '05 Oct', receipt: true, status: 'Pending' },
  { id: 'CLM-0422', category: 'Meals', amount: 'RM 80', date: '03 Oct', receipt: true, status: 'Approved' },
  { id: 'CLM-0421', category: 'Travel', amount: 'RM 180', date: '02 Oct', receipt: true, status: 'Approved' },
  { id: 'CLM-0420', category: 'Parking', amount: 'RM 20', date: '01 Oct', receipt: true, status: 'Approved' },
  { id: 'CLM-0418', category: 'Accommodation', amount: 'RM 260', date: '28 Sep', receipt: true, status: 'Approved' },
  { id: 'CLM-0415', category: 'Travel', amount: 'RM 240', date: '24 Sep', receipt: false, status: 'Rejected' },
];

export default function ClaimsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Financial Claims"
        subtitle="Submit and track your expense claims, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Claim
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Claimed (MTD)"
            value="RM 1,240"
            delta="+RM 320"
            deltaTone="up"
            onPrimary
            chart={
              <Sparkline
                data={[640, 720, 810, 900, 1000, 1080, 1180, 1240]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Approved"
            value="RM 980"
            delta="+9%"
            deltaTone="up"
            chart={
              <Sparkline data={[520, 580, 650, 720, 800, 860, 920, 980]} color="var(--chart-2)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending"
            value="RM 260"
            delta="1 claim"
            deltaTone="flat"
            chart={
              <Sparkline data={[0, 120, 80, 200, 160, 120, 200, 260]} color="var(--chart-4)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Reimbursed"
            value="RM 820"
            delta="paid out"
            deltaTone="flat"
            chart={
              <Sparkline data={[400, 460, 520, 600, 660, 720, 780, 820]} color="var(--chart-1)" height={36} />
            }
          />
        </BentoCard>

        {/* Category donut + breakdown */}
        <BentoCard
          title="Claims by category"
          subtitle="This month · RM"
          icon={PieChart}
          className="col-span-2 md:col-span-5"
        >
          <DonutStat
            data={CATEGORY_MIX}
            height={230}
            centerValue="RM 1,240"
            centerLabel="claimed"
          />
        </BentoCard>
        <BentoCard
          title="Spend by category"
          subtitle="Share of claims this month"
          icon={Wallet}
          className="col-span-2 md:col-span-7"
        >
          <ul className="flex flex-col gap-4 py-1">
            {CATEGORY_MIX.map((c) => (
              <li key={c.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    RM {c.value.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={Math.round((c.value / TOTAL_CLAIMED) * 100)}
                  className="mt-2 h-1.5"
                />
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Claims table */}
        <BentoCard
          title="My Requests"
          subtitle="Expense claims and their status"
          icon={Receipt}
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
                    <TableCell className="whitespace-nowrap font-medium">{r.category}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{r.amount}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {r.receipt ? 'Attached' : '—'}
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
