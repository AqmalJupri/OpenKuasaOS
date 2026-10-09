'use client';

import {
  TrendingUp,
  Receipt,
  CircleCheck,
  Users,
  Clock,
  BarChart3,
  Lightbulb,
  SquareKanban,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  BarGroup,
  DonutStat,
  RadialGauge,
  Sparkline,
  FunnelFlow,
  type Series,
  type Slice,
} from '@/components/charts';

export type CardType =
  | 'overview'
  | 'leads'
  | 'priorities'
  | 'invoices'
  | 'pipeline'
  | 'team'
  | 'ads';

export function ReplyCard({ type }: { type: CardType }) {
  switch (type) {
    case 'overview':
      return <OverviewCard />;
    case 'leads':
      return <LeadsCard />;
    case 'priorities':
      return <PrioritiesCard />;
    case 'invoices':
      return <InvoicesCard />;
    case 'pipeline':
      return <PipelineCard />;
    case 'team':
      return <TeamCard />;
    case 'ads':
      return <AdsCard />;
  }
}

/** Small pill used in a few card headers. */
function Trend({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      <TrendingUp className="size-3.5" />
      {children}
    </span>
  );
}

/* ---------- Business overview ---------- */

const OVERVIEW_KPIS: {
  label: string;
  value: string;
  delta: string;
  deltaTone: 'up' | 'down' | 'flat';
  spark: number[];
  color: string;
}[] = [
  {
    label: 'Revenue',
    value: 'RM 48,250',
    delta: '+12%',
    deltaTone: 'up',
    spark: [32, 38, 35, 42, 45, 48],
    color: 'var(--chart-1)',
  },
  {
    label: 'New leads',
    value: '184',
    delta: '+9%',
    deltaTone: 'up',
    spark: [120, 140, 135, 160, 175, 184],
    color: 'var(--chart-2)',
  },
  {
    label: 'Deals won',
    value: '23',
    delta: '+4',
    deltaTone: 'up',
    spark: [15, 17, 16, 19, 21, 23],
    color: 'var(--chart-5)',
  },
  {
    label: 'Cash runway',
    value: '7.2 mo',
    delta: 'healthy',
    deltaTone: 'flat',
    spark: [6.1, 6.4, 6.6, 6.9, 7.0, 7.2],
    color: 'var(--chart-3)',
  },
];

const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const REVENUE = [32, 38, 35, 42, 45, 48];
const REVENUE_TREND: Record<string, string | number>[] = MONTHS.map((m, i) => ({
  label: m,
  revenue: REVENUE[i],
}));
const REVENUE_SERIES: Series[] = [
  { key: 'revenue', label: 'Revenue (RM k)', color: 'var(--chart-1)' },
];

function OverviewCard() {
  return (
    <BentoCard
      title="October at a glance"
      subtitle="Month to date · up 12% MoM"
      icon={BarChart3}
    >
      <div className="grid grid-cols-2 gap-3">
        {OVERVIEW_KPIS.map((k) => (
          <div key={k.label} className="min-w-0 rounded-lg bg-muted/40 p-3">
            <BentoStat
              label={k.label}
              value={k.value}
              delta={k.delta}
              deltaTone={k.deltaTone}
              chart={<Sparkline data={k.spark} color={k.color} height={32} />}
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Revenue, last 6 months (RM k)
        </p>
        <AreaTrend data={REVENUE_TREND} series={REVENUE_SERIES} height={160} />
      </div>
    </BentoCard>
  );
}

/* ---------- Leads ---------- */

const LEAD_SOURCES: Slice[] = [
  { key: 'meta', label: 'Meta Ads', value: 22, color: 'var(--chart-1)' },
  { key: 'whatsapp', label: 'WhatsApp', value: 14, color: 'var(--chart-2)' },
  { key: 'forms', label: 'Lead Forms', value: 8, color: 'var(--chart-5)' },
  { key: 'referral', label: 'Referral', value: 3, color: 'var(--chart-3)' },
];

function LeadsCard() {
  const total = LEAD_SOURCES.reduce((a, s) => a + s.value, 0);
  return (
    <BentoCard
      title="New leads this week"
      subtitle="Meta Ads leads, WhatsApp close behind"
      icon={Users}
      action={<Trend>+18% vs last week</Trend>}
    >
      <DonutStat
        data={LEAD_SOURCES}
        centerValue={String(total)}
        centerLabel="this week"
        height={210}
      />
    </BentoCard>
  );
}

/* ---------- Priorities ---------- */

const PRIORITIES: {
  icon: LucideIcon;
  text: string;
  sub: string;
  action: string;
}[] = [
  {
    icon: Receipt,
    text: 'Invoice INV-1041 is 6 days overdue',
    sub: 'Rimba Retail · RM 4,200',
    action: 'Chase',
  },
  {
    icon: TrendingUp,
    text: '“Rimba Retail” deal is hot',
    sub: 'Proposal sent 3 days ago · RM 28,000',
    action: 'Follow up',
  },
  {
    icon: CircleCheck,
    text: '2 leave requests awaiting your approval',
    sub: 'Aisyah Rahim, Faiz Hakim',
    action: 'Review',
  },
];

function PrioritiesCard() {
  return (
    <BentoCard title="Top 3 for today" icon={Lightbulb}>
      <ul className="space-y-2.5">
        {PRIORITIES.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.text} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{p.text}</p>
                <p className="text-xs text-muted-foreground">{p.sub}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                {p.action}
              </button>
            </li>
          );
        })}
      </ul>
    </BentoCard>
  );
}

/* ---------- Overdue invoices ---------- */

const INVOICES: {
  key: string;
  inv: string;
  customer: string;
  amount: number;
  days: string;
  color: string;
}[] = [
  {
    key: 'inv1032',
    inv: 'INV-1032',
    customer: 'Seri Maju Sdn Bhd',
    amount: 7400,
    days: '18d',
    color: 'var(--chart-1)',
  },
  {
    key: 'inv1041',
    inv: 'INV-1041',
    customer: 'Rimba Retail',
    amount: 4200,
    days: '6d',
    color: 'var(--chart-2)',
  },
  {
    key: 'inv1038',
    inv: 'INV-1038',
    customer: 'Melur Café',
    amount: 1850,
    days: '11d',
    color: 'var(--chart-5)',
  },
];

const INVOICE_SLICES: Slice[] = INVOICES.map((r) => ({
  key: r.key,
  label: r.inv,
  value: r.amount,
  color: r.color,
}));

function InvoicesCard() {
  return (
    <BentoCard
      title="Overdue invoices (3)"
      subtitle="RM 13,450 outstanding · oldest 18 days"
      icon={Receipt}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <DonutStat
            data={INVOICE_SLICES}
            centerValue="RM 13.5k"
            centerLabel="overdue"
            showLegend={false}
            height={180}
          />
        </div>
        <div className="min-w-0 divide-y rounded-lg border">
          {INVOICES.map((r) => (
            <div key={r.key} className="flex items-center gap-2 px-3 py-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: r.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.customer}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {r.inv}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular-nums">
                  RM {r.amount.toLocaleString('en-MY')}
                </p>
                <p className="text-[11px] font-medium text-red-600">{r.days}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}

/* ---------- Deals pipeline ---------- */

const PIPELINE_FUNNEL: Slice[] = [
  { key: 'new', label: 'New Lead', value: 7, color: 'var(--chart-1)' },
  { key: 'contacted', label: 'Contacted', value: 5, color: 'var(--chart-2)' },
  { key: 'qualified', label: 'Qualified', value: 4, color: 'var(--chart-5)' },
  { key: 'proposal', label: 'Proposal', value: 2, color: 'var(--chart-3)' },
];

function PipelineCard() {
  return (
    <BentoCard
      title="Sales pipeline"
      subtitle="7 open deals · Rimba Retail is biggest"
      icon={SquareKanban}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid min-w-0 grid-cols-2 content-start gap-3">
          <BentoStat label="Open value" value="RM 56.2k" delta="7 deals" deltaTone="flat" />
          <BentoStat label="Won (MTD)" value="RM 42k" delta="3 deals" deltaTone="up" />
        </div>
        <div className="min-w-0">
          <FunnelFlow data={PIPELINE_FUNNEL} height={160} />
        </div>
      </div>
    </BentoCard>
  );
}

/* ---------- Team & payroll ---------- */

const TEAM_KPIS: { label: string; value: string }[] = [
  { label: 'Headcount', value: '24' },
  { label: 'Pending', value: '3' },
  { label: 'Next payroll', value: 'RM 86.4k' },
];

const APPROVALS: { icon: LucideIcon; text: string; sub: string }[] = [
  {
    icon: CircleCheck,
    text: '2 leave requests',
    sub: 'Aisyah Rahim, Faiz Hakim',
  },
  { icon: Receipt, text: '1 expense claim · RM 340', sub: 'Ahmad Zaki' },
];

function TeamCard() {
  return (
    <BentoCard
      title="Team & payroll"
      subtitle="24 people · payroll runs 28 Oct"
      icon={Users}
    >
      <div className="grid grid-cols-3 gap-3">
        {TEAM_KPIS.map((s) => (
          <div key={s.label} className="min-w-0 rounded-lg bg-muted/40 p-3">
            <BentoStat label={s.label} value={s.value} />
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <RadialGauge
            value={96}
            max={100}
            label="Attendance"
            valueLabel="96%"
            color="var(--chart-2)"
            height={200}
          />
        </div>
        <div className="min-w-0 space-y-2">
          {APPROVALS.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.text} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.text}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.sub}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
                >
                  Review
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5 shrink-0" />
        Payroll runs 28 Oct · RM 86,400 with EPF, SOCSO &amp; PCB included
      </p>
    </BentoCard>
  );
}

/* ---------- Ad performance ---------- */

const AD_KPIS: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'up' | 'down' | 'flat';
  spark: number[];
  color: string;
}[] = [
  {
    label: 'Spend',
    value: 'RM 4,820',
    spark: [3200, 3600, 4100, 4400, 4600, 4820],
    color: 'var(--chart-1)',
  },
  {
    label: 'Leads',
    value: '184',
    delta: '+9%',
    deltaTone: 'up',
    spark: [120, 140, 135, 160, 175, 184],
    color: 'var(--chart-2)',
  },
  {
    label: 'Cost / lead',
    value: 'RM 26',
    delta: '−RM 4',
    deltaTone: 'up',
    spark: [34, 31, 30, 28, 27, 26],
    color: 'var(--chart-5)',
  },
  {
    label: 'ROAS',
    value: '3.4×',
    delta: '+0.4',
    deltaTone: 'up',
    spark: [2.6, 2.8, 3.0, 3.1, 3.3, 3.4],
    color: 'var(--chart-3)',
  },
];

const AD_CHANNELS: Record<string, string | number>[] = [
  { label: 'Meta Ads', leads: 104 },
  { label: 'WhatsApp', leads: 46 },
  { label: 'Google', leads: 22 },
  { label: 'TikTok', leads: 12 },
];
const AD_SERIES: Series[] = [
  { key: 'leads', label: 'Leads', color: 'var(--chart-1)' },
];

function AdsCard() {
  return (
    <BentoCard
      title="Ad performance · October"
      subtitle="RM 4,820 spent · 184 leads"
      icon={Megaphone}
      action={<Trend>ROAS 3.4×</Trend>}
    >
      <div className="grid grid-cols-2 gap-3">
        {AD_KPIS.map((k) => (
          <div key={k.label} className="min-w-0 rounded-lg bg-muted/40 p-3">
            <BentoStat
              label={k.label}
              value={k.value}
              delta={k.delta}
              deltaTone={k.deltaTone}
              chart={<Sparkline data={k.spark} color={k.color} height={32} />}
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Leads by channel
        </p>
        <BarGroup data={AD_CHANNELS} series={AD_SERIES} horizontal height={150} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Meta Ads drives the most leads at RM 22 each; WhatsApp click-to-chat is
        your cheapest channel.
      </p>
    </BentoCard>
  );
}
