import {
  Banknote,
  Landmark,
  PieChart,
  Plus,
  Receipt,
  TrendingUp,
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

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

const RECEIPTS_TREND = [
  { label: 'Wk1', bank: 4.2, cash: 0.6 },
  { label: 'Wk2', bank: 5.1, cash: 0.8 },
  { label: 'Wk3', bank: 3.8, cash: 0.4 },
  { label: 'Wk4', bank: 6.0, cash: 0.9 },
  { label: 'Wk5', bank: 5.4, cash: 0.5 },
  { label: 'Wk6', bank: 7.2, cash: 1.1 },
  { label: 'Wk7', bank: 6.6, cash: 0.7 },
  { label: 'Wk8', bank: 7.8, cash: 1.0 },
];
const RECEIPTS_SERIES: Series[] = [
  { key: 'bank', label: 'Bank (RM k)', color: 'var(--chart-1)' },
  { key: 'cash', label: 'Cash (RM k)', color: 'var(--chart-2)' },
];

/** Received by account (RM), MTD — sums to 28,400. */
const BY_ACCOUNT: Slice[] = [
  { key: 'bank', label: 'Main Bank (Maybank)', value: 25200, color: 'var(--chart-1)' },
  { key: 'cash', label: 'Cash in hand', value: 3200, color: 'var(--chart-2)' },
];

type Receipt = {
  id: string;
  date: string;
  no: string;
  from: string;
  account: string;
  method: string;
  amount: string;
  status: 'Posted' | 'Draft';
};

const RECEIPTS: Receipt[] = [
  { id: '1', date: '02 Oct 2026', no: 'RC-2026-0141', from: 'Aisyah Trading', account: 'Main Bank', method: 'FPX', amount: 'RM 6,800.00', status: 'Posted' },
  { id: '2', date: '01 Oct 2026', no: 'RC-2026-0140', from: 'Kedai Runcit Pak Din', account: 'Cash', method: 'Cash', amount: 'RM 850.00', status: 'Posted' },
  { id: '3', date: '30 Sep 2026', no: 'RC-2026-0139', from: 'Tan & Sons Enterprise', account: 'Main Bank', method: 'DuitNow', amount: 'RM 9,200.00', status: 'Posted' },
  { id: '4', date: '29 Sep 2026', no: 'RC-2026-0138', from: 'Nurul Boutique', account: 'Cash', method: 'Cash', amount: 'RM 1,450.00', status: 'Posted' },
  { id: '5', date: '27 Sep 2026', no: 'RC-2026-0137', from: 'Zaki Logistics Sdn Bhd', account: 'Main Bank', method: 'FPX', amount: 'RM 7,600.00', status: 'Posted' },
  { id: '6', date: '25 Sep 2026', no: 'RC-2026-0136', from: 'Mei Ling Bakery', account: 'Cash', method: 'Cash', amount: 'RM 900.00', status: 'Posted' },
  { id: '7', date: '24 Sep 2026', no: 'RC-2026-0135', from: 'Seri Mutiara Enterprise', account: 'Main Bank', method: 'DuitNow', amount: 'RM 4,320.00', status: 'Posted' },
  { id: '8', date: '22 Sep 2026', no: 'RC-2026-0134', from: 'Langkawi Fresh', account: 'Main Bank', method: 'Cheque', amount: 'RM 2,180.00', status: 'Draft' },
];

/* ------------------------------------------------------------------ */

export default function CashReceiptsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Cash Receipts"
        subtitle="Money received into cash & bank, Saudara."
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
              New receipt
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Received (MTD)"
            value="RM 28.4k"
            delta="+11%"
            onPrimary
            chart={
              <Sparkline
                data={[4.2, 5.1, 3.8, 6.0, 5.4, 7.2, 6.6, 7.8]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Receipts"
            value="14"
            delta="+3"
            deltaTone="up"
            chart={
              <Sparkline
                data={[8, 9, 7, 11, 10, 12, 13, 14]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg receipt"
            value="RM 2,029"
            delta="+4%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[1.7, 1.8, 1.9, 1.85, 2.0, 1.95, 2.02, 2.03]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Bank share"
            value="89%"
            delta="+2pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[82, 84, 83, 86, 85, 87, 88, 89]}
                color="var(--chart-1)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Trend + account mix */}
        <BentoCard
          title="Receipts over time"
          subtitle="Bank vs cash · last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend
            data={RECEIPTS_TREND}
            series={RECEIPTS_SERIES}
            height={240}
            stacked
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="By account"
          subtitle="Received MTD"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={BY_ACCOUNT}
            height={240}
            centerValue="RM 28.4k"
            centerLabel="received"
          />
        </BentoCard>

        {/* Receipts table */}
        <BentoCard
          title="Recent receipts"
          subtitle="Latest money in across cash & bank"
          icon={Receipt}
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
                  <TableHead>Received from</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECEIPTS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {r.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {r.no}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{r.from}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        {r.account === 'Cash' ? (
                          <Banknote className="size-3.5" />
                        ) : (
                          <Landmark className="size-3.5" />
                        )}
                        {r.account}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {r.method}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                      {r.amount}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={r.status === 'Posted'} />
                        <span
                          className={
                            r.status === 'Posted'
                              ? 'inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600'
                              : 'inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                          }
                        >
                          {r.status}
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
