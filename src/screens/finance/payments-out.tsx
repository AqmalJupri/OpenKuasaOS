import { Plus, TrendingUp, PieChart, Wallet } from 'lucide-react';
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

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type PaymentStatus = 'Paid' | 'Scheduled' | 'Pending';
type PaymentMethod = 'Bank Transfer' | 'FPX' | 'Cash' | 'Cheque';

type Payment = {
  id: string;
  date: string;
  supplier: string;
  bill: string;
  method: PaymentMethod;
  amount: string;
  status: PaymentStatus;
};

const COLUMNS = ['Date', 'Supplier', 'Bill', 'Method', 'Amount', 'Status'];

const PAYMENTS: Payment[] = [
  {
    id: 'PAY-0119',
    date: '07 Oct 2026',
    supplier: 'Nusantara Logistics',
    bill: 'BILL-0225',
    method: 'FPX',
    amount: 'RM 1,180.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0118',
    date: '06 Oct 2026',
    supplier: 'Printhub Enterprise',
    bill: 'BILL-0230',
    method: 'Bank Transfer',
    amount: 'RM 1,450.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0117',
    date: '04 Oct 2026',
    supplier: 'Unifi Business (TM)',
    bill: 'BILL-0227',
    method: 'Bank Transfer',
    amount: 'RM 299.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0116',
    date: '02 Oct 2026',
    supplier: 'Kedai Kertas Ah Seng',
    bill: 'BILL-0224',
    method: 'Cash',
    amount: 'RM 1,650.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0115',
    date: '28 Sep 2026',
    supplier: 'Lim Hardware Sdn Bhd',
    bill: 'BILL-0221',
    method: 'Cheque',
    amount: 'RM 4,200.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0114',
    date: '10 Oct 2026',
    supplier: 'Tenaga Nasional Berhad',
    bill: 'BILL-0229',
    method: 'Bank Transfer',
    amount: 'RM 1,800.00',
    status: 'Scheduled',
  },
  {
    id: 'PAY-0113',
    date: '12 Oct 2026',
    supplier: 'Syarikat Maju Jaya',
    bill: 'BILL-0228',
    method: 'Bank Transfer',
    amount: 'RM 4,300.00',
    status: 'Pending',
  },
];

const STATUS_STYLES: Record<PaymentStatus, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Scheduled: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

/* KPI sparkline trends ------------------------------------------------ */
const SPARK_PAID = [8.0, 9.0, 10.0, 11.0, 11.5, 12.0, 12.1, 12.1];
const SPARK_COUNT = [24, 28, 26, 31, 33, 35, 37, 38];
const SPARK_ELECTRONIC = [72, 76, 78, 80, 82, 84, 85, 86];
const SPARK_SCHEDULED = [2.2, 1.8, 2.4, 2.0, 1.6, 2.1, 1.9, 1.8];

/* Payments over time (last 8 months, RM k) ---------------------------- */
const PAID_TREND = [
  { label: 'Mar', electronic: 7.2, cash: 2.1 },
  { label: 'Apr', electronic: 8.0, cash: 1.8 },
  { label: 'May', electronic: 8.6, cash: 2.4 },
  { label: 'Jun', electronic: 9.1, cash: 2.0 },
  { label: 'Jul', electronic: 9.8, cash: 1.6 },
  { label: 'Aug', electronic: 10.2, cash: 2.1 },
  { label: 'Sep', electronic: 10.4, cash: 1.9 },
  { label: 'Oct', electronic: 10.4, cash: 1.7 },
];
const PAID_SERIES: Series[] = [
  { key: 'electronic', label: 'Bank / FPX (RM k)', color: 'var(--chart-1)' },
  { key: 'cash', label: 'Cash / cheque (RM k)', color: 'var(--chart-2)' },
];

/** Paid MTD by method (RM k) — sums to 12.1. */
const BY_METHOD: Slice[] = [
  { key: 'bank', label: 'Bank Transfer', value: 6.6, color: 'var(--chart-1)' },
  { key: 'fpx', label: 'FPX', value: 3.8, color: 'var(--chart-2)' },
  { key: 'cash', label: 'Cash', value: 1.3, color: 'var(--chart-3)' },
  { key: 'cheque', label: 'Cheque', value: 0.4, color: 'var(--chart-4)' },
];

/* ------------------------------------------------------------------ */

export default function PaymentsOutScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payments Out"
        subtitle="Payments made to suppliers, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Record Payment
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Paid (MTD)"
            value="RM 12.1k"
            delta="+9%"
            onPrimary
            chart={
              <Sparkline data={SPARK_PAID} color="var(--primary-foreground)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Payments"
            value="38"
            delta="+6"
            deltaTone="up"
            chart={<Sparkline data={SPARK_COUNT} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Via bank / FPX"
            value="86%"
            delta="+4%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_ELECTRONIC} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Scheduled"
            value="RM 1,800"
            delta="1 payment"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_SCHEDULED} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>

        {/* Trend + method mix */}
        <BentoCard
          title="Payments over time"
          subtitle="Electronic vs cash · last 8 months"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={PAID_TREND} series={PAID_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Paid by method"
          subtitle="Month to date"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={BY_METHOD}
            height={240}
            centerValue="RM 12.1k"
            centerLabel="paid"
          />
        </BentoCard>

        {/* Payments table */}
        <BentoCard
          title="Recent payments"
          subtitle="Latest activity to suppliers"
          icon={Wallet}
          action={
            <Button variant="outline" size="sm">
              View all
            </Button>
          }
          className="col-span-2 md:col-span-12"
        >
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
                {PAYMENTS.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {p.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {p.supplier}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{p.bill}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.method}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {p.amount}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={p.status === 'Paid'} />
                        <StatusPill status={p.status} />
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
