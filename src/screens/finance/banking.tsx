import { TrendingUp, Gauge, Landmark } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { AreaTrend, RadialGauge, Sparkline, type Series } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
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

type Account = {
  name: string;
  balance: string;
  spark: number[];
};

/** Aggregate = sum of the three tiles (72,400 + 8,100 + 11,800). */
const ACCOUNTS: Account[] = [
  { name: 'Maybank — Current', balance: 'RM 72,400', spark: [60, 62, 65, 67, 69, 70, 71, 72.4] },
  { name: 'CIMB — Savings', balance: 'RM 8,100', spark: [6, 6.5, 7, 7.2, 7.6, 7.8, 8, 8.1] },
  { name: 'Cash', balance: 'RM 11,800', spark: [9, 10, 10.5, 11, 11.2, 11.5, 11.6, 11.8] },
];

const SPARK_TOTAL = [76, 79, 83, 85, 88, 90, 91, 92.3];

/* Cash position over time (last 8 months, RM k) ----------------------- */
const CASH_TREND = [
  { label: 'Mar', balance: 78 },
  { label: 'Apr', balance: 81 },
  { label: 'May', balance: 83 },
  { label: 'Jun', balance: 85 },
  { label: 'Jul', balance: 88 },
  { label: 'Aug', balance: 90 },
  { label: 'Sep', balance: 91 },
  { label: 'Oct', balance: 92.3 },
];
const CASH_SERIES: Series[] = [
  { key: 'balance', label: 'Cash position (RM k)', color: 'var(--chart-1)' },
];

type TxnStatus = 'Reconciled' | 'Unreconciled';

type Txn = {
  id: string;
  date: string;
  description: string;
  account: string;
  moneyIn?: string;
  moneyOut?: string;
  status: TxnStatus;
};

const COLUMNS = [
  'Date',
  'Description',
  'Account',
  'Money In',
  'Money Out',
  'Status',
];

const TRANSACTIONS: Txn[] = [
  {
    id: 't1',
    date: '07 Oct 2026',
    description: 'Payment received — Aisyah Trading',
    account: 'Maybank — Current',
    moneyIn: 'RM 1,240.00',
    status: 'Unreconciled',
  },
  {
    id: 't2',
    date: '06 Oct 2026',
    description: 'Printhub Enterprise — BILL-0230',
    account: 'Maybank — Current',
    moneyOut: 'RM 1,450.00',
    status: 'Reconciled',
  },
  {
    id: 't3',
    date: '05 Oct 2026',
    description: 'Payment received — Zaki Enterprise',
    account: 'Maybank — Current',
    moneyIn: 'RM 3,500.00',
    status: 'Reconciled',
  },
  {
    id: 't4',
    date: '04 Oct 2026',
    description: 'Unifi Business — BILL-0227',
    account: 'CIMB — Savings',
    moneyOut: 'RM 299.00',
    status: 'Reconciled',
  },
  {
    id: 't5',
    date: '03 Oct 2026',
    description: 'Counter sales — cash deposit',
    account: 'Cash',
    moneyIn: 'RM 2,150.00',
    status: 'Unreconciled',
  },
  {
    id: 't6',
    date: '02 Oct 2026',
    description: 'Kedai Kertas Ah Seng — BILL-0224',
    account: 'Cash',
    moneyOut: 'RM 1,650.00',
    status: 'Reconciled',
  },
  {
    id: 't7',
    date: '01 Oct 2026',
    description: 'Bank charges — Maybank',
    account: 'Maybank — Current',
    moneyOut: 'RM 25.00',
    status: 'Unreconciled',
  },
];

const STATUS_STYLES: Record<TxnStatus, string> = {
  Reconciled: 'bg-emerald-500/15 text-emerald-600',
  Unreconciled: 'bg-amber-500/15 text-amber-600',
};

function StatusPill({ status }: { status: TxnStatus }) {
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

/* ------------------------------------------------------------------ */

export default function BankingScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Banking"
        subtitle="Accounts, balances and reconciliation, Saudara."
      />

      <BentoGrid>
        {/* Balance tiles — aggregate + per account */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total cash"
            value="RM 92,300"
            delta="+RM 4.2k"
            onPrimary
            chart={
              <Sparkline data={SPARK_TOTAL} color="var(--primary-foreground)" height={36} />
            }
          />
        </BentoCard>
        {ACCOUNTS.map((a, i) => (
          <BentoCard key={a.name} className="col-span-1 md:col-span-3">
            <BentoStat
              label={a.name}
              value={a.balance}
              delta="Synced 2h ago"
              deltaTone="flat"
              chart={
                <Sparkline
                  data={a.spark}
                  color={`var(--chart-${i + 1})`}
                  height={36}
                />
              }
            />
          </BentoCard>
        ))}

        {/* Cash position + reconciliation */}
        <BentoCard
          title="Cash position"
          subtitle="All accounts · last 8 months"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={CASH_TREND} series={CASH_SERIES} height={240} />
        </BentoCard>
        <BentoCard
          title="Reconciliation"
          subtitle="142 of 156 October txns"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge
            value={91}
            valueLabel="91%"
            label="reconciled"
            color="var(--chart-2)"
            height={240}
          />
        </BentoCard>

        {/* Transactions ledger */}
        <BentoCard
          title="Transactions"
          subtitle="Recent · reconciliation status"
          icon={Landmark}
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
                {TRANSACTIONS.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {t.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {t.description}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{t.account}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums text-emerald-600">
                      {t.moneyIn ?? ''}
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums text-red-600">
                      {t.moneyOut ?? ''}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={t.status === 'Reconciled'} />
                        <StatusPill status={t.status} />
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
