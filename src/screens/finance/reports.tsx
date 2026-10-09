import {
  BarChart3,
  BookOpen,
  Clock,
  Download,
  FileText,
  Gauge,
  ListChecks,
  PieChart,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  BarGroup,
  DonutStat,
  RadialGauge,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
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

/* ---- mock data (Rimba Ventures Sdn Bhd · FY2026) ------------------ */

/* Revenue vs expenses over the financial year (RM k) ------------------ */
const PL_TREND = [
  { label: 'Jan', revenue: 36, expenses: 22 },
  { label: 'Feb', revenue: 38, expenses: 23 },
  { label: 'Mar', revenue: 40, expenses: 22 },
  { label: 'Apr', revenue: 39, expenses: 24 },
  { label: 'May', revenue: 44, expenses: 25 },
  { label: 'Jun', revenue: 46, expenses: 24 },
  { label: 'Jul', revenue: 48, expenses: 26 },
  { label: 'Aug', revenue: 42, expenses: 23 },
  { label: 'Sep', revenue: 45, expenses: 24 },
  { label: 'Oct', revenue: 40, expenses: 23 },
];
const PL_SERIES: Series[] = [
  { key: 'revenue', label: 'Revenue (RM k)', color: 'var(--chart-1)' },
  { key: 'expenses', label: 'Expenses (RM k)', color: 'var(--chart-4)' },
];

/* Net profit by month (RM k) ------------------------------------------ */
const NET_BY_MONTH = PL_TREND.map((m) => ({
  label: m.label,
  net: m.revenue - m.expenses,
}));
const NET_SERIES: Series[] = [
  { key: 'net', label: 'Net profit (RM k)', color: 'var(--chart-2)' },
];

/* Expense breakdown YTD (RM k) — sums to 236 -------------------------- */
const EXPENSE_MIX: Slice[] = [
  { key: 'salaries', label: 'Salaries', value: 96, color: 'var(--chart-1)' },
  { key: 'rent', label: 'Rent', value: 42, color: 'var(--chart-2)' },
  { key: 'marketing', label: 'Marketing', value: 34, color: 'var(--chart-5)' },
  { key: 'utilities', label: 'Utilities', value: 18, color: 'var(--chart-4)' },
  { key: 'others', label: 'Supplies, SST & other', value: 46, color: 'var(--chart-3)' },
];

/* KPI sparklines ------------------------------------------------------ */
const SPARK_REVENUE = [36, 38, 40, 39, 44, 46, 48, 42, 45, 40];
const SPARK_EXPENSES = [22, 23, 22, 24, 25, 24, 26, 23, 24, 23];
const SPARK_PROFIT = [14, 15, 18, 15, 19, 22, 22, 19, 21, 17];
const SPARK_MARGIN = [39, 39, 45, 38, 43, 48, 46, 45, 47, 43];

/* Revenue & expense by account (ledger summary) ----------------------- */
type AccountRow = {
  account: string;
  kind: 'Income' | 'Expense';
  amount: string;
  yoy: string;
  yoyTone: 'up' | 'down';
};

const TOP_ACCOUNTS: AccountRow[] = [
  { account: 'Sales — Services', kind: 'Income', amount: 'RM 262,000', yoy: '+14%', yoyTone: 'up' },
  { account: 'Sales — Products', kind: 'Income', amount: 'RM 156,000', yoy: '+9%', yoyTone: 'up' },
  { account: 'Salaries & wages', kind: 'Expense', amount: 'RM 96,000', yoy: '+6%', yoyTone: 'down' },
  { account: 'Office rent', kind: 'Expense', amount: 'RM 42,000', yoy: '0%', yoyTone: 'down' },
  { account: 'Marketing & ads', kind: 'Expense', amount: 'RM 34,000', yoy: '+11%', yoyTone: 'down' },
  { account: 'Utilities (TNB & Unifi)', kind: 'Expense', amount: 'RM 18,000', yoy: '+3%', yoyTone: 'down' },
  { account: 'SST payable', kind: 'Expense', amount: 'RM 12,000', yoy: '+5%', yoyTone: 'down' },
];

/* Statement library --------------------------------------------------- */
type Report = { name: string; description: string; icon: LucideIcon };

const STATEMENTS: Report[] = [
  { name: 'Profit & Loss', description: 'Revenue, costs and net profit for a period.', icon: BarChart3 },
  { name: 'Balance Sheet', description: 'Assets, liabilities and equity at a date.', icon: Scale },
  { name: 'Cash Flow', description: 'Cash moving in and out of your business.', icon: TrendingUp },
  { name: 'Trial Balance', description: 'Debit and credit totals for every account.', icon: ListChecks },
  { name: 'General Ledger', description: 'Every posted transaction by account.', icon: BookOpen },
  { name: 'Aged Receivables', description: 'Outstanding customer invoices by age.', icon: Clock },
  { name: 'Aged Payables', description: 'Unpaid supplier bills by age.', icon: Clock },
  { name: 'SST Tax Summary', description: 'SST collected and payable for filing.', icon: ShieldCheck },
  { name: 'Sales by Customer', description: 'Revenue breakdown for each customer.', icon: Users },
];

/* ------------------------------------------------------------------ */

export default function ReportsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Financial Reports"
        subtitle="Revenue, profitability and statements, Saudara."
        actions={
          <>
            <Select defaultValue="ytd">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtd">This month</SelectItem>
                <SelectItem value="qtd">This quarter</SelectItem>
                <SelectItem value="ytd">Financial YTD</SelectItem>
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
            label="Revenue (YTD)"
            value="RM 418k"
            delta="+12%"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_REVENUE}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Expenses (YTD)"
            value="RM 236k"
            delta="+6%"
            deltaTone="down"
            chart={<Sparkline data={SPARK_EXPENSES} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Net profit"
            value="RM 182k"
            delta="+18%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_PROFIT} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Net margin"
            value="43.5%"
            delta="+1.4pt"
            deltaTone="up"
            chart={<Sparkline data={SPARK_MARGIN} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>

        {/* Trend + expense mix */}
        <BentoCard
          title="Revenue vs expenses"
          subtitle="Financial year to date"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={PL_TREND} series={PL_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Expense breakdown"
          subtitle="By category · YTD"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={EXPENSE_MIX}
            height={240}
            centerValue="RM 236k"
            centerLabel="expenses"
          />
        </BentoCard>

        {/* P&L bars + margin gauge */}
        <BentoCard
          title="Net profit by month"
          subtitle="Revenue less expenses · RM k"
          icon={BarChart3}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup data={NET_BY_MONTH} series={NET_SERIES} height={240} />
        </BentoCard>
        <BentoCard
          title="Profit margin"
          subtitle="Net profit ÷ revenue"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge
            value={44}
            valueLabel="43.5%"
            label="net margin"
            color="var(--chart-2)"
            height={240}
          />
        </BentoCard>

        {/* Account summary table */}
        <BentoCard
          title="By account"
          subtitle="Revenue & expense accounts · YTD"
          icon={Wallet}
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount (RM)</TableHead>
                  <TableHead className="text-right">YoY</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_ACCOUNTS.map((a) => (
                  <TableRow key={a.account}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {a.account}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          a.kind === 'Income'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                        )}
                      >
                        {a.kind}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {a.amount}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'whitespace-nowrap text-right tabular-nums',
                        a.yoyTone === 'up'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-muted-foreground',
                      )}
                    >
                      {a.yoy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </BentoCard>

        {/* Statement library */}
        <BentoCard
          title="Financial statements"
          subtitle="Generate a statement for any period"
          icon={FileText}
          className="col-span-2 md:col-span-12"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STATEMENTS.map((r) => (
              <div
                key={r.name}
                className="flex items-start gap-3 rounded-lg border bg-background/60 p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight">{r.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.description}</p>
                  <button
                    type="button"
                    className="mt-1.5 text-xs font-medium uppercase tracking-wide text-primary hover:underline"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
