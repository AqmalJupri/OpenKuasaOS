import { PieChart, Plus, TrendingDown, Wallet } from 'lucide-react';
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

const PAID_TREND = [
  { label: 'Wk1', paid: 2.8 },
  { label: 'Wk2', paid: 3.6 },
  { label: 'Wk3', paid: 2.1 },
  { label: 'Wk4', paid: 4.4 },
  { label: 'Wk5', paid: 3.2 },
  { label: 'Wk6', paid: 5.1 },
  { label: 'Wk7', paid: 4.0 },
  { label: 'Wk8', paid: 4.9 },
];
const PAID_SERIES: Series[] = [
  { key: 'paid', label: 'Paid out (RM k)', color: 'var(--chart-1)' },
];

/** Payments by category (RM), MTD — sums to 19,600. */
const BY_CATEGORY: Slice[] = [
  { key: 'suppliers', label: 'Supplier bills', value: 9240, color: 'var(--chart-1)' },
  { key: 'utilities', label: 'Utilities', value: 3080, color: 'var(--chart-2)' },
  { key: 'rent', label: 'Rent & premises', value: 4500, color: 'var(--chart-5)' },
  { key: 'services', label: 'Services', value: 2780, color: 'var(--chart-3)' },
];

type Voucher = {
  id: string;
  date: string;
  no: string;
  to: string;
  account: string;
  category: string;
  amount: string;
  status: 'Paid' | 'Pending';
};

const VOUCHERS: Voucher[] = [
  { id: '1', date: '03 Oct 2026', no: 'PV-2026-0088', to: 'Lim Hardware Sdn Bhd', account: 'Main Bank', category: 'Supplier bills', amount: 'RM 3,450.00', status: 'Paid' },
  { id: '2', date: '02 Oct 2026', no: 'PV-2026-0087', to: 'Suria Utilities Sdn Bhd', account: 'Main Bank', category: 'Utilities', amount: 'RM 1,280.00', status: 'Paid' },
  { id: '3', date: '01 Oct 2026', no: 'PV-2026-0086', to: 'Syarikat Ramli & Anak', account: 'Main Bank', category: 'Rent & premises', amount: 'RM 2,200.00', status: 'Pending' },
  { id: '4', date: '30 Sep 2026', no: 'PV-2026-0085', to: 'Printhub Solutions', account: 'Main Bank', category: 'Services', amount: 'RM 640.00', status: 'Paid' },
  { id: '5', date: '28 Sep 2026', no: 'PV-2026-0084', to: 'Kedai Kain Kak Siti', account: 'Main Bank', category: 'Supplier bills', amount: 'RM 5,900.00', status: 'Paid' },
  { id: '6', date: '26 Sep 2026', no: 'PV-2026-0083', to: 'Wong Packaging Enterprise', account: 'Main Bank', category: 'Supplier bills', amount: 'RM 1,730.00', status: 'Paid' },
  { id: '7', date: '24 Sep 2026', no: 'PV-2026-0082', to: 'Nusantara Logistics', account: 'Main Bank', category: 'Services', amount: 'RM 2,140.00', status: 'Pending' },
  { id: '8', date: '22 Sep 2026', no: 'PV-2026-0081', to: 'Syabas Air Selangor', account: 'Main Bank', category: 'Utilities', amount: 'RM 420.00', status: 'Paid' },
];

/* ------------------------------------------------------------------ */

export default function PaymentVouchersScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payment Vouchers"
        subtitle="Money paid out to suppliers & expenses, Saudara."
        actions={
          <>
            <Select defaultValue="mtd">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtd">This month</SelectItem>
                <SelectItem value="qtd">This quarter</SelectItem>
                <SelectItem value="ytd">Financial YTD</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="size-4" />
              New voucher
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Paid (MTD)"
            value="RM 19.6k"
            delta="+6%"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline
                data={[2.8, 3.6, 2.1, 4.4, 3.2, 5.1, 4.0, 4.9]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Vouchers"
            value="11"
            delta="+2"
            deltaTone="flat"
            chart={
              <Sparkline
                data={[6, 7, 6, 9, 8, 10, 10, 11]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending approval"
            value="RM 2.2k"
            delta="2 vouchers"
            deltaTone="down"
            chart={
              <Sparkline
                data={[0.6, 0.6, 1.2, 1.2, 1.8, 1.8, 2.2, 2.2]}
                color="var(--chart-4)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg voucher"
            value="RM 1,782"
            delta="−3%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[2.0, 1.95, 1.9, 1.85, 1.82, 1.8, 1.79, 1.78]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Trend + category mix */}
        <BentoCard
          title="Payments over time"
          subtitle="Paid out · last 8 weeks"
          icon={TrendingDown}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={PAID_TREND} series={PAID_SERIES} height={240} />
        </BentoCard>
        <BentoCard
          title="By category"
          subtitle="Paid MTD"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={BY_CATEGORY}
            height={240}
            centerValue="RM 19.6k"
            centerLabel="paid"
          />
        </BentoCard>

        {/* Vouchers table */}
        <BentoCard
          title="Recent vouchers"
          subtitle="Latest money out across your accounts"
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
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead>No.</TableHead>
                  <TableHead>Paid to</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VOUCHERS.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {v.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {v.no}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{v.to}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {v.category}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{v.account}</TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                      {v.amount}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={v.status === 'Paid'} />
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            v.status === 'Paid'
                              ? 'bg-emerald-500/15 text-emerald-600'
                              : 'bg-amber-500/15 text-amber-600',
                          )}
                        >
                          {v.status === 'Paid' ? 'Paid' : 'Pending approval'}
                        </span>
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
