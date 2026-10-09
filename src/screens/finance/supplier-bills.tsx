import { Plus, Search, ChartColumn, PieChart, FileText } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  BarGroup,
  DonutStat,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type BillStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

type Bill = {
  id: string;
  date: string;
  supplier: string;
  due: string;
  total: string;
  balance: string;
  status: BillStatus;
};

const COLUMNS = ['No.', 'Date', 'Supplier', 'Due', 'Total', 'Balance', 'Status'];

const BILLS: Bill[] = [
  {
    id: 'BILL-0232',
    date: '08 Oct 2026',
    supplier: 'Nusantara Logistics',
    due: '13 Oct 2026',
    total: 'RM 2,600.00',
    balance: 'RM 2,600.00',
    status: 'Pending',
  },
  {
    id: 'BILL-0231',
    date: '05 Oct 2026',
    supplier: 'Lim Hardware Sdn Bhd',
    due: '04 Nov 2026',
    total: 'RM 3,200.00',
    balance: 'RM 3,200.00',
    status: 'Pending',
  },
  {
    id: 'BILL-0230',
    date: '30 Sep 2026',
    supplier: 'Printhub Enterprise',
    due: '30 Oct 2026',
    total: 'RM 1,450.00',
    balance: 'RM 0.00',
    status: 'Paid',
  },
  {
    id: 'BILL-0229',
    date: '22 Sep 2026',
    supplier: 'Tenaga Nasional Berhad',
    due: '06 Oct 2026',
    total: 'RM 1,800.00',
    balance: 'RM 1,800.00',
    status: 'Overdue',
  },
  {
    id: 'BILL-0228',
    date: '18 Sep 2026',
    supplier: 'Syarikat Maju Jaya',
    due: '18 Oct 2026',
    total: 'RM 4,300.00',
    balance: 'RM 4,300.00',
    status: 'Pending',
  },
  {
    id: 'BILL-0227',
    date: '10 Sep 2026',
    supplier: 'Unifi Business (TM)',
    due: '10 Oct 2026',
    total: 'RM 299.00',
    balance: 'RM 0.00',
    status: 'Paid',
  },
  {
    id: 'BILL-0226',
    date: '07 Oct 2026',
    supplier: 'Kedai Kertas Ah Seng',
    due: '06 Nov 2026',
    total: 'RM 780.00',
    balance: 'RM 780.00',
    status: 'Draft',
  },
];

const STATUS_STYLES: Record<BillStatus, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Overdue: 'bg-red-500/15 text-red-600',
  Draft: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: BillStatus }) {
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

/* KPI sparkline trends (monthly, RM k) -------------------------------- */
const SPARK_PAYABLE = [9.8, 10.5, 11.2, 10.9, 11.8, 12.0, 12.4, 12.7];
const SPARK_WEEK = [1.2, 2.0, 1.6, 2.8, 2.2, 2.6, 2.4, 2.6];
const SPARK_OVERDUE = [0.5, 0.8, 1.1, 0.9, 1.3, 1.5, 1.7, 1.8];
const SPARK_PAID = [8.0, 9.0, 10.0, 11.0, 11.5, 12.0, 12.1, 12.1];

/** Outstanding balance by supplier (RM). */
const BY_SUPPLIER = [
  { label: 'Maju Jaya', value: 4300 },
  { label: 'Lim Hardware', value: 3200 },
  { label: 'Nusantara', value: 2600 },
  { label: 'TNB', value: 1800 },
  { label: 'Ah Seng', value: 780 },
];
const SUPPLIER_SERIES: Series[] = [
  { key: 'value', label: 'Outstanding (RM)', color: 'var(--chart-1)' },
];

/** Bills by status — sums to 7. */
const BY_STATUS: Slice[] = [
  { key: 'pending', label: 'Pending', value: 3, color: 'var(--chart-1)' },
  { key: 'paid', label: 'Paid', value: 2, color: 'var(--chart-2)' },
  { key: 'overdue', label: 'Overdue', value: 1, color: 'var(--chart-4)' },
  { key: 'draft', label: 'Draft', value: 1, color: 'var(--chart-3)' },
];

/* ------------------------------------------------------------------ */

export default function SupplierBillsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Supplier Bills"
        subtitle="Bills payable to your suppliers, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Bill
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total payable"
            value="RM 12.7k"
            delta="+RM 2.6k"
            onPrimary
            chart={
              <Sparkline data={SPARK_PAYABLE} color="var(--primary-foreground)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Due this week"
            value="RM 2,600"
            delta="1 bill"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_WEEK} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Overdue"
            value="RM 1,800"
            delta="1 bill"
            deltaTone="down"
            chart={<Sparkline data={SPARK_OVERDUE} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Paid (MTD)"
            value="RM 12.1k"
            delta="+9%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_PAID} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>

        {/* Payable by supplier + status mix */}
        <BentoCard
          title="Payable by supplier"
          subtitle="Outstanding balance"
          icon={ChartColumn}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={BY_SUPPLIER}
            series={SUPPLIER_SERIES}
            horizontal
            height={220}
          />
        </BentoCard>
        <BentoCard
          title="Bills by status"
          subtitle="Current book"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat data={BY_STATUS} height={220} centerValue="7" centerLabel="bills" />
        </BentoCard>

        {/* Bills table */}
        <BentoCard
          title="Recent bills"
          subtitle="Latest activity from suppliers"
          icon={FileText}
          flush
          action={
            <Button variant="outline" size="sm">
              View all
            </Button>
          }
          className="col-span-2 md:col-span-12"
        >
          <div className="flex flex-wrap items-center gap-2 px-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search bills or suppliers…" className="w-full pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                {BILLS.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.id}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {b.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{b.supplier}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {b.due}
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {b.total}
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {b.balance}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={b.status === 'Paid'} />
                        <StatusPill status={b.status} />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>Showing {BILLS.length} of 231 bills</span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
