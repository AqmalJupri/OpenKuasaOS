import {
  CircleCheck,
  Clock,
  PieChart,
  Plus,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  DonutStat,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
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

/* ---- mock data (Rimba Ventures Sdn Bhd · October 2026) ------------ */

type Voucher = {
  id: string;
  payee: string;
  purpose: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Pending';
};

const VOUCHERS: Voucher[] = [
  { id: 'PV-1042', payee: 'Aisyah Rahim', purpose: 'Salary — Oct', amount: 'RM 3,372', date: '28 Oct', status: 'Paid' },
  { id: 'PV-1041', payee: 'Faiz Hakim', purpose: 'Claim reimbursement', amount: 'RM 180', date: '06 Oct', status: 'Paid' },
  { id: 'PV-1040', payee: 'Ahmad Zaki', purpose: 'OT payment', amount: 'RM 200', date: '05 Oct', status: 'Pending' },
  { id: 'PV-1039', payee: 'Vendor — Printing', purpose: 'Office supplies', amount: 'RM 420', date: '03 Oct', status: 'Paid' },
  { id: 'PV-1038', payee: 'Nurul Huda', purpose: 'Travel claim', amount: 'RM 150', date: '01 Oct', status: 'Paid' },
  { id: 'PV-1037', payee: 'Siti Aminah', purpose: 'Medical claim', amount: 'RM 240', date: '29 Sep', status: 'Pending' },
];

/* Voucher value issued over time (RM k) — last 8 weeks. */
const ISSUED_TREND = [
  { label: 'Wk1', value: 3.1 },
  { label: 'Wk2', value: 3.4 },
  { label: 'Wk3', value: 2.9 },
  { label: 'Wk4', value: 3.8 },
  { label: 'Wk5', value: 3.2 },
  { label: 'Wk6', value: 4.1 },
  { label: 'Wk7', value: 3.9 },
  { label: 'Wk8', value: 4.0 },
];
const ISSUED_SERIES: Series[] = [
  { key: 'value', label: 'Issued (RM k)', color: 'var(--chart-1)' },
];

/** Vouchers by type this month (RM) — sums to RM 28,400. */
const TYPE_MIX: Slice[] = [
  { key: 'salary', label: 'Salary', value: 19800, color: 'var(--chart-1)' },
  { key: 'claims', label: 'Claims', value: 4200, color: 'var(--chart-2)' },
  { key: 'ot', label: 'Overtime', value: 2600, color: 'var(--chart-3)' },
  { key: 'vendor', label: 'Vendor', value: 1800, color: 'var(--chart-4)' },
];

function StatusPill({ status }: { status: Voucher['status'] }) {
  return (
    <span className="flex items-center gap-2">
      <LiveDot active={status === 'Paid'} />
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          status === 'Paid'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
        )}
      >
        {status}
      </span>
    </span>
  );
}

export default function PaymentVouchersScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payment Vouchers"
        subtitle="Salary & reimbursement vouchers, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Voucher
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Vouchers"
            value="42"
            delta="+7"
            onPrimary
            chart={
              <Sparkline
                data={[31, 34, 29, 38, 32, 41, 39, 42]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Paid"
            value="36"
            delta="+9%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[27, 30, 26, 33, 29, 36, 35, 36]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending"
            value="6"
            delta="+2"
            deltaTone="down"
            chart={
              <Sparkline
                data={[4, 4, 3, 5, 3, 5, 4, 6]}
                color="var(--chart-4)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Value this month"
            value="RM 28.4k"
            delta="+6%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[21, 23, 24, 26, 25, 27, 28, 28.4]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Value trend + type mix */}
        <BentoCard
          title="Voucher value issued"
          subtitle="Last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={ISSUED_TREND} series={ISSUED_SERIES} height={220} />
        </BentoCard>
        <BentoCard
          title="Vouchers by type"
          subtitle="This month"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={TYPE_MIX}
            height={220}
            centerValue="RM 28.4k"
            centerLabel="issued"
          />
        </BentoCard>

        {/* Vouchers table */}
        <BentoCard
          title="Recent vouchers"
          subtitle="Latest salary & reimbursement vouchers"
          icon={Receipt}
          action={
            <Button variant="outline" size="sm">
              View all
            </Button>
          }
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Voucher #</TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VOUCHERS.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {v.id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{v.payee}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {v.purpose}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold tabular-nums">
                      {v.amount}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {v.date}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={v.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CircleCheck className="size-4 text-emerald-600" /> 36 paid
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-amber-600" /> 6 pending
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Wallet className="size-4" /> RM 28,400 issued
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
