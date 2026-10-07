import {
  TrendingUp,
  Receipt,
  CircleCheck,
  ArrowUpRight,
  Users,
  Banknote,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const SHELL = 'rounded-xl border bg-card p-4 shadow-sm';

/* ---------- Business overview ---------- */

const STATS = [
  { label: 'Revenue', value: 'RM 48,250', delta: '+12%' },
  { label: 'New leads', value: '184', delta: '+9%' },
  { label: 'Deals won', value: '23', delta: '+4' },
  { label: 'Cash runway', value: '7.2 mo', delta: 'healthy' },
];
const REVENUE = [32, 38, 35, 42, 45, 48];
const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

function OverviewCard() {
  const max = Math.max(...REVENUE);
  return (
    <div className={SHELL}>
      <p className="text-sm font-semibold">October at a glance</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg bg-muted/50 p-3">
            <p className="text-lg font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-primary">
              <ArrowUpRight className="size-3" />
              {s.delta}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Revenue, last 6 months (RM k)
        </p>
        <div className="flex items-end gap-2">
          {REVENUE.map((v, i) => (
            <div key={MONTHS[i]} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-24 w-full items-end">
                <div
                  className={cn(
                    'w-full rounded-t',
                    i === REVENUE.length - 1 ? 'bg-primary' : 'bg-primary/25',
                  )}
                  style={{ height: `${(v / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {MONTHS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Leads ---------- */

const SOURCES = [
  { label: 'Meta Ads', value: 22 },
  { label: 'WhatsApp', value: 14 },
  { label: 'Lead Forms', value: 8 },
  { label: 'Referral', value: 3 },
];

function LeadsCard() {
  const total = SOURCES.reduce((a, s) => a + s.value, 0);
  const max = Math.max(...SOURCES.map((s) => s.value));
  return (
    <div className={SHELL}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight">{total}</p>
          <p className="text-xs text-muted-foreground">new leads this week</p>
        </div>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          <TrendingUp className="size-3.5" />
          +18% vs last week
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {SOURCES.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs text-muted-foreground">
              {s.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(s.value / max) * 100}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-medium">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
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
    <div className={SHELL}>
      <p className="text-sm font-semibold">Top 3 for today</p>
      <ul className="mt-3 space-y-2.5">
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
    </div>
  );
}

/* ---------- Overdue invoices ---------- */

const INVOICES = [
  { inv: 'INV-1041', customer: 'Rimba Retail', amount: 'RM 4,200', days: '6d' },
  { inv: 'INV-1038', customer: 'Melur Café', amount: 'RM 1,850', days: '11d' },
  { inv: 'INV-1032', customer: 'Seri Maju Sdn Bhd', amount: 'RM 7,400', days: '18d' },
];

function InvoicesCard() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-semibold">Overdue invoices (3)</p>
        <p className="text-sm font-semibold text-red-600">RM 13,450</p>
      </div>
      <div className="divide-y">
        {INVOICES.map((r) => (
          <div key={r.inv} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
              {r.inv}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {r.customer}
            </span>
            <span className="shrink-0 text-sm font-semibold">{r.amount}</span>
            <span className="w-10 shrink-0 text-right text-xs font-medium text-red-600">
              {r.days}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Deals pipeline ---------- */

const STAGES = [
  { label: 'New Lead', count: 2, value: 17400 },
  { label: 'Contacted', count: 2, value: 12400 },
  { label: 'Qualified', count: 2, value: 19200 },
  { label: 'Proposal Sent', count: 1, value: 7200 },
  { label: 'Won', count: 3, value: 42000 },
];

function PipelineCard() {
  const open = STAGES.filter((s) => s.label !== 'Won').reduce(
    (a, s) => a + s.value,
    0,
  );
  const max = Math.max(...STAGES.map((s) => s.value));
  return (
    <div className={SHELL}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold">Sales pipeline</p>
          <p className="text-xs text-muted-foreground">7 open deals</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tracking-tight">
            RM {open.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">open value</p>
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        {STAGES.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{s.label}</span> ·{' '}
              {s.count}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full',
                  s.label === 'Won' ? 'bg-primary' : 'bg-primary/40',
                )}
                style={{ width: `${(s.value / max) * 100}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-xs font-medium">
              RM {s.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Team & payroll ---------- */

const TEAM_STATS: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: Users, label: 'Headcount', value: '24' },
  { icon: CircleCheck, label: 'Pending', value: '3' },
  { icon: Banknote, label: 'Next payroll', value: 'RM 86,400' },
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
    <div className={SHELL}>
      <p className="text-sm font-semibold">Team &amp; payroll</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {TEAM_STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-lg bg-muted/50 p-3">
              <Icon className="size-4 text-primary" />
              <p className="mt-1 text-base font-bold tracking-tight">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 space-y-2">
        {APPROVALS.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.text} className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.sub}</p>
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
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5 shrink-0" />
        Payroll runs 28 Oct · EPF, SOCSO &amp; PCB included
      </p>
    </div>
  );
}

/* ---------- Ad performance ---------- */

const AD_STATS = [
  { label: 'Spend', value: 'RM 4,820' },
  { label: 'Leads', value: '184' },
  { label: 'Cost / lead', value: 'RM 26' },
  { label: 'ROAS', value: '3.4×' },
];

function AdsCard() {
  return (
    <div className={SHELL}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Ad performance · October</p>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          <TrendingUp className="size-3.5" />
          ROAS 3.4×
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {AD_STATS.map((s) => (
          <div key={s.label} className="rounded-lg bg-muted/50 p-3">
            <p className="text-lg font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Meta Ads is driving the most leads at RM 22 each; WhatsApp click-to-chat
        is your cheapest channel.
      </p>
    </div>
  );
}
