import {
  ArrowUp,
  BadgeCheck,
  Bot,
  CreditCard,
  Filter,
  Gauge,
  HandCoins,
  Mic,
  PieChart,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  BarGroup,
  DonutStat,
  FunnelFlow,
  RadialGauge,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd · 201901027453) ------------ */

/** Operational cash in vs out, weekly (RM k). Distinct from the monthly
 *  balance trend on the Dashboard. */
const CASHFLOW_TREND = [
  { label: 'Wk1', inflow: 9.2, outflow: 6.1 },
  { label: 'Wk2', inflow: 11.4, outflow: 7.0 },
  { label: 'Wk3', inflow: 8.6, outflow: 5.4 },
  { label: 'Wk4', inflow: 12.8, outflow: 8.2 },
  { label: 'Wk5', inflow: 10.5, outflow: 6.8 },
  { label: 'Wk6', inflow: 13.2, outflow: 7.9 },
  { label: 'Wk7', inflow: 11.8, outflow: 7.1 },
  { label: 'Wk8', inflow: 14.0, outflow: 8.6 },
];
const CASHFLOW_SERIES: Series[] = [
  { key: 'inflow', label: 'Cash in (RM k)', color: 'var(--chart-2)' },
  { key: 'outflow', label: 'Cash out (RM k)', color: 'var(--chart-3)' },
];

/** Revenue by category, this month (RM k) — sums to 42.8 = Revenue MTD. */
const REVENUE_BY_CATEGORY: Slice[] = [
  { key: 'services', label: 'Services', value: 18.4, color: 'var(--chart-1)' },
  { key: 'projects', label: 'Projects', value: 12.2, color: 'var(--chart-2)' },
  { key: 'supplies', label: 'Supplies', value: 8.0, color: 'var(--chart-5)' },
  { key: 'maintenance', label: 'Maintenance', value: 4.2, color: 'var(--chart-3)' },
];

/** Collections funnel — invoice counts (not RM). */
const COLLECTIONS: Slice[] = [
  { key: 'issued', label: 'Issued', value: 164, color: 'var(--chart-1)' },
  { key: 'sent', label: 'Sent', value: 150, color: 'var(--chart-2)' },
  { key: 'viewed', label: 'Viewed', value: 128, color: 'var(--chart-5)' },
  { key: 'paid', label: 'Paid', value: 106, color: 'var(--chart-4)' },
];

/** Outstanding (AR) by customer (RM k) — sums to 16.9 = Outstanding KPI.
 *  Not due 9.7 (Siti + Zaki) + overdue 7.2 (Nurul + Hakim + Lestari); ties to
 *  the Dashboard's AR ageing buckets (9.7 / 4.2 / 2.0 / 1.0). */
const AR_BY_CUSTOMER = [
  { label: 'Siti Decor', amount: 6.2 },
  { label: 'Nurul Boutique', amount: 4.2 },
  { label: 'Zaki Enterprise', amount: 3.5 },
  { label: 'Hakim Logistics', amount: 2.0 },
  { label: 'Lestari Group', amount: 1.0 },
];
const AR_SERIES: Series[] = [
  { key: 'amount', label: 'Outstanding (RM k)', color: 'var(--chart-2)' },
];

type Receivable = { id: string; customer: string; amount: string; age: string; overdue: boolean };
/** Past-due invoices — sum RM 7,200 = the 1–30d + 31–60d + 60d+ ageing buckets. */
const RECEIVABLES: Receivable[] = [
  { id: 'INV-1040', customer: 'Nurul Boutique', amount: 'RM 4,200', age: '12 days overdue', overdue: true },
  { id: 'INV-1037', customer: 'Hakim Logistics', amount: 'RM 2,000', age: '38 days overdue', overdue: true },
  { id: 'INV-1029', customer: 'Lestari Group', amount: 'RM 1,000', age: '65 days overdue', overdue: true },
];

type Bill = { id: string; supplier: string; amount: string; due: string };
/** Upcoming supplier bills — sums to RM 9,300 = Payable (AP) KPI. */
const UPCOMING_BILLS: Bill[] = [
  { id: 'BILL-304', supplier: 'Lim Hardware', amount: 'RM 3,300', due: '14 Oct' },
  { id: 'BILL-302', supplier: 'Nusantara Logistics', amount: 'RM 2,800', due: '18 Oct' },
  { id: 'BILL-301', supplier: 'Langkawi Fresh', amount: 'RM 1,900', due: '22 Oct' },
  { id: 'BILL-299', supplier: 'Seri Mutiara Enterprise', amount: 'RM 1,300', due: '28 Oct' },
];

type EInvoiceStatus = 'Validated' | 'Pending' | 'Rejected';
type EInvoiceRow = { id: string; customer: string; status: EInvoiceStatus };
const EINVOICE: EInvoiceRow[] = [
  { id: 'INV-1042', customer: 'Aisyah Trading', status: 'Validated' },
  { id: 'INV-1041', customer: 'Zaki Enterprise', status: 'Validated' },
  { id: 'INV-1040', customer: 'Nurul Boutique', status: 'Pending' },
  { id: 'INV-1039', customer: 'Lim Hardware', status: 'Validated' },
  { id: 'INV-1037', customer: 'Hakim Logistics', status: 'Rejected' },
];
const EINVOICE_PILL: Record<EInvoiceStatus, string> = {
  Validated: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

const AGENTS = [
  { name: 'Invoice Chaser', active: true },
  { name: 'Receipt Reader', active: true },
  { name: 'Reconciler', active: true },
  { name: 'e-Invoice Submitter', active: true },
  { name: 'Cashflow Forecaster', active: false },
  { name: 'Tax Estimator', active: false },
];

const PROMPTS = [
  'Cash position?',
  'Overdue invoices',
  "Summarise this month's P&L",
  'SST due this month',
];

/* ------------------------------------------------------------------ */

export default function OverviewScreen() {
  return (
    <ScreenContainer>
      <BentoGrid>
        {/* Ask-Bendahara hero */}
        <BentoCard tone="primary" className="col-span-2 md:col-span-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-primary-foreground/70">
                <Sparkles className="size-3.5 animate-twinkle" />
                Bendahara · your CFO
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                How are the books looking, Saudara?
              </h1>
              <p className="mt-1 text-xs text-primary-foreground/70">
                Prudent guardian of the treasury — RM, SST and LHDN e-Invois. Powered by
                Taming Sari.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground ring-1 ring-inset ring-primary-foreground/20 transition hover:bg-primary-foreground/20"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex w-full items-center gap-2 rounded-2xl bg-primary-foreground/10 p-2 ring-1 ring-inset ring-primary-foreground/20 lg:w-96">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                <Plus className="size-4" />
              </span>
              <span className="flex-1 truncate text-sm text-primary-foreground/70">
                Ask Bendahara anything…
              </span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                <Mic className="size-4" />
              </span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary">
                <ArrowUp className="size-4" />
              </span>
            </div>
          </div>
        </BentoCard>

        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Cash balance"
            value="RM 84,200"
            delta="+6%"
            onPrimary
            chart={
              <Sparkline
                data={[71, 74, 72, 78, 80, 81, 83, 84]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Revenue · MTD"
            value="RM 42,800"
            delta="+14%"
            deltaTone="up"
            chart={<Sparkline data={[28, 31, 33, 36, 39, 41, 42, 43]} height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Outstanding · AR"
            value="RM 16,900"
            delta="−5%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[21, 20, 19, 18, 18, 17, 17, 16.9]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Payable · AP"
            value="RM 9,300"
            delta="+RM 1.2k"
            deltaTone="down"
            chart={
              <Sparkline
                data={[6.8, 7.1, 7.4, 7.9, 8.2, 8.6, 9.0, 9.3]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Cash flow + revenue mix */}
        <BentoCard
          title="Cash in vs out"
          subtitle="Weekly · last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={CASHFLOW_TREND} series={CASHFLOW_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Revenue by category"
          subtitle="This month"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={REVENUE_BY_CATEGORY}
            height={240}
            centerValue="RM 42.8k"
            centerLabel="revenue"
          />
        </BentoCard>

        {/* Collections funnel + AR by customer + collection rate */}
        <BentoCard
          title="Collections"
          subtitle="Issued → paid"
          icon={Filter}
          className="col-span-2 md:col-span-4"
        >
          <FunnelFlow data={COLLECTIONS} height={200} />
        </BentoCard>
        <BentoCard
          title="Outstanding by customer"
          subtitle="Receivables (RM k)"
          icon={Users}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup data={AR_BY_CUSTOMER} series={AR_SERIES} horizontal height={200} />
        </BentoCard>
        <BentoCard
          title="Collection rate"
          subtitle="Collected of billed"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge value={82} label="collected" valueLabel="82%" color="var(--chart-2)" height={200} />
        </BentoCard>

        {/* Needs collecting + e-Invois status */}
        <BentoCard
          title="Overdue invoices"
          subtitle="Receivables to chase"
          icon={HandCoins}
          className="col-span-2 md:col-span-8"
        >
          <ul className="divide-y">
            {RECEIVABLES.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2.5">
                <LiveDot active={!r.overdue} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.id}</p>
                </div>
                <span
                  className={cn(
                    'hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline-block',
                    r.overdue
                      ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {r.age}
                </span>
                <span className="w-20 shrink-0 text-right text-sm font-semibold tabular-nums">
                  {r.amount}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard
          title="e-Invois · LHDN MyInvois"
          subtitle="Submission status"
          icon={BadgeCheck}
          className="col-span-2 md:col-span-4"
        >
          <ul className="space-y-2">
            {EINVOICE.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-2.5 rounded-lg border bg-background/50 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.id}</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                    EINVOICE_PILL[e.status],
                  )}
                >
                  {e.status}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Upcoming bills + finance agents */}
        <BentoCard
          title="Upcoming bills"
          subtitle="Payables due · RM 9,300"
          icon={CreditCard}
          className="col-span-2 md:col-span-6"
        >
          <ul className="divide-y">
            {UPCOMING_BILLS.map((b) => (
              <li key={b.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.supplier}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.id} · due {b.due}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {b.amount}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard
          title="Finance AI agents"
          subtitle="Your always-on crew"
          icon={Bot}
          className="col-span-2 md:col-span-6"
        >
          <div className="grid grid-cols-2 gap-2">
            {AGENTS.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-2 rounded-lg border bg-background/50 px-3 py-2"
              >
                <LiveDot active={a.active} />
                <span className="min-w-0 flex-1 truncate text-sm">{a.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {a.active ? 'Active' : 'Paused'}
                </span>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
