import {
  ArrowUp,
  Bot,
  Cake,
  CalendarDays,
  ClipboardCheck,
  Gauge,
  Mic,
  PieChart,
  Plane,
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
  RadialGauge,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';

/* ---- mock data (Rimba Ventures Sdn Bhd · Lekiu / HR) --------------- */

/** Monthly headcount — last point (20) = Headcount KPI = Σ department mix. */
const HEADCOUNT_TREND = [
  { label: 'Mar', headcount: 16 },
  { label: 'Apr', headcount: 16 },
  { label: 'May', headcount: 17 },
  { label: 'Jun', headcount: 18 },
  { label: 'Jul', headcount: 18 },
  { label: 'Aug', headcount: 19 },
  { label: 'Sep', headcount: 19 },
  { label: 'Oct', headcount: 20 },
];
const HEADCOUNT_SERIES: Series[] = [
  { key: 'headcount', label: 'Headcount', color: 'var(--chart-1)' },
];

/** Headcount by department — sums to 20 = Headcount KPI. */
const DEPT_MIX: Slice[] = [
  { key: 'sales', label: 'Sales', value: 6, color: 'var(--chart-1)' },
  { key: 'ops', label: 'Operations', value: 5, color: 'var(--chart-2)' },
  { key: 'marketing', label: 'Marketing', value: 3, color: 'var(--chart-5)' },
  { key: 'finance', label: 'Finance', value: 3, color: 'var(--chart-3)' },
  { key: 'management', label: 'Management', value: 3, color: 'var(--chart-4)' },
];

/** Leave days taken this month by type — sums to 16 (ties to dashboard donut). */
const LEAVE_BY_TYPE = [
  { label: 'Annual', days: 8 },
  { label: 'Medical', days: 5 },
  { label: 'Emergency', days: 2 },
  { label: 'Unpaid', days: 1 },
];
const LEAVE_SERIES: Series[] = [
  { key: 'days', label: 'Days', color: 'var(--chart-2)' },
];

/** On leave today (3) = On-leave KPI. Date: Friday, 09 October 2026. */
const ON_LEAVE_TODAY = [
  { name: 'Siti Lestari', kind: 'Annual leave', when: '07–10 Oct' },
  { name: 'Lim Wei Jie', kind: 'Medical leave', when: '09 Oct' },
  { name: 'Nurul Huda', kind: 'Emergency leave', when: '09 Oct' },
];

/** Pending approvals (6) = Pending-approvals KPI (Leave 3 · Claim 2 · OT 1). */
type Approval = { name: string; type: string; detail: string };
const PENDING_APPROVALS: Approval[] = [
  { name: 'Aisyah Rahim', type: 'Annual leave', detail: '2 days · 20–21 Oct' },
  { name: 'Faiz Hakim', type: 'Medical claim', detail: 'RM 240 · clinic' },
  { name: 'Ahmad Zaki', type: 'Overtime', detail: '4 hrs · 08 Oct' },
  { name: 'Amirul Danial', type: 'Annual leave', detail: '1 day · 15 Oct' },
  { name: 'Nurul Huda', type: 'Travel claim', detail: 'RM 180 · site visit' },
  { name: 'Mei Ling Tan', type: 'Emergency leave', detail: '1 day · 13 Oct' },
];

const UPCOMING = [
  { name: 'Nurul Huda', occasion: 'Birthday', when: '18 Oct', icon: Cake },
  { name: 'Ahmad Zaki', occasion: '3-year anniversary', when: '24 Oct', icon: CalendarDays },
  { name: 'Aisyah Rahim', occasion: 'Birthday', when: '29 Oct', icon: Cake },
];

const AGENTS = [
  { name: 'Leave Approver', active: true },
  { name: 'Payroll Assistant', active: true },
  { name: 'Onboarding Guide', active: true },
  { name: 'Attendance Monitor', active: false },
];

const PROMPTS = [
  "Who's on leave today?",
  'Headcount by dept',
  'Pending approvals',
  'Draft a Hari Raya leave notice',
];

/* ------------------------------------------------------------------ */

export default function OverviewScreen() {
  return (
    <ScreenContainer>
      <BentoGrid>
        {/* Ask-Lekiu hero */}
        <BentoCard tone="primary" className="col-span-2 md:col-span-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-primary-foreground/70">
                <Sparkles className="size-3.5 animate-twinkle" />
                Lekiu · your HR co-pilot
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                How is the team doing, Saudara?
              </h1>
              <p className="mt-1 text-xs text-primary-foreground/70">
                Keeper of team and culture. Powered by Taming Sari.
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
                Ask Lekiu anything…
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
            label="Headcount"
            value="20"
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={[16, 16, 17, 18, 18, 19, 19, 20]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Present today"
            value="16"
            delta="94%"
            deltaTone="up"
            chart={<Sparkline data={[14, 15, 16, 15, 17, 16, 18, 16]} height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="On leave"
            value="3"
            delta="+1"
            deltaTone="flat"
            chart={
              <Sparkline
                data={[1, 2, 1, 3, 2, 2, 3, 3]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending approvals"
            value="6"
            delta="−2"
            deltaTone="up"
            chart={
              <Sparkline
                data={[9, 8, 10, 7, 8, 7, 8, 6]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Headcount trend + department mix */}
        <BentoCard
          title="Headcount over time"
          subtitle="Last 8 months"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={HEADCOUNT_TREND} series={HEADCOUNT_SERIES} height={240} />
        </BentoCard>
        <BentoCard
          title="By department"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat data={DEPT_MIX} height={240} centerValue="20" centerLabel="staff" />
        </BentoCard>

        {/* Leave by type + attendance + agents */}
        <BentoCard
          title="Leave by type"
          subtitle="Days taken this month"
          icon={Plane}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup data={LEAVE_BY_TYPE} series={LEAVE_SERIES} horizontal height={200} />
        </BentoCard>
        <BentoCard
          title="Attendance rate"
          subtitle="Present vs expected"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge value={94} label="present" valueLabel="94%" color="var(--chart-2)" height={200} />
        </BentoCard>
        <BentoCard
          title="HR AI agents"
          subtitle="Your always-on crew"
          icon={Bot}
          className="col-span-2 md:col-span-4"
        >
          <div className="grid grid-cols-1 gap-2">
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

        {/* Today's leave + pending approvals + upcoming */}
        <BentoCard
          title="On leave today"
          subtitle="Friday, 09 October 2026"
          icon={Plane}
          className="col-span-2 md:col-span-4"
        >
          <ul className="space-y-2">
            {ON_LEAVE_TODAY.map((p) => (
              <li
                key={p.name}
                className="flex items-center gap-3 rounded-lg border bg-background/50 px-3 py-2"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {p.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.kind}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {p.when}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard
          title="Pending approvals"
          subtitle="Awaiting your action"
          icon={ClipboardCheck}
          className="col-span-2 md:col-span-4"
        >
          <ul className="divide-y">
            {PENDING_APPROVALS.map((a) => (
              <li key={`${a.name}-${a.type}`} className="flex items-center gap-3 py-2">
                <LiveDot active />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {a.type}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard
          title="Birthdays & anniversaries"
          subtitle="Coming up this month"
          icon={Users}
          className="col-span-2 md:col-span-4"
        >
          <ul className="space-y-2">
            {UPCOMING.map((u) => {
              const Icon = u.icon;
              return (
                <li
                  key={`${u.name}-${u.occasion}`}
                  className="flex items-center gap-3 rounded-lg border bg-background/50 px-3 py-2"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.occasion}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {u.when}
                  </span>
                </li>
              );
            })}
          </ul>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
