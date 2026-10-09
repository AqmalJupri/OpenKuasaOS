import {
  ArrowUp,
  Bot,
  CalendarCheck,
  Filter,
  Gauge,
  Mic,
  PieChart,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  DonutStat,
  FunnelFlow,
  RadialGauge,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

/** Applications received per week (last 8 weeks) + shortlisted. */
const APPS_TREND = [
  { label: 'Wk1', applied: 24, shortlisted: 8 },
  { label: 'Wk2', applied: 29, shortlisted: 11 },
  { label: 'Wk3', applied: 27, shortlisted: 9 },
  { label: 'Wk4', applied: 35, shortlisted: 14 },
  { label: 'Wk5', applied: 32, shortlisted: 12 },
  { label: 'Wk6', applied: 40, shortlisted: 16 },
  { label: 'Wk7', applied: 37, shortlisted: 14 },
  { label: 'Wk8', applied: 44, shortlisted: 18 },
];
const APPS_SERIES: Series[] = [
  { key: 'applied', label: 'Applied', color: 'var(--chart-1)' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'var(--chart-2)' },
];

/** Applications by source — sums to 248 = Candidates. */
const SOURCE_MIX: Slice[] = [
  { key: 'jobstreet', label: 'JobStreet', value: 104, color: 'var(--chart-1)' },
  { key: 'linkedin', label: 'LinkedIn', value: 72, color: 'var(--chart-2)' },
  { key: 'referral', label: 'Referral', value: 44, color: 'var(--chart-5)' },
  { key: 'careers', label: 'Careers page', value: 28, color: 'var(--chart-3)' },
];

/** Hiring pipeline snapshot. Applied = 248 = Candidates; Offer = 4 = Offers out. */
const PIPELINE: Slice[] = [
  { key: 'applied', label: 'Applied', value: 248, color: 'var(--chart-1)' },
  { key: 'screening', label: 'Screening', value: 96, color: 'var(--chart-2)' },
  { key: 'interview', label: 'Interview', value: 38, color: 'var(--chart-5)' },
  { key: 'offer', label: 'Offer', value: 4, color: 'var(--chart-3)' },
  { key: 'hired', label: 'Hired', value: 2, color: 'var(--chart-4)' },
];

type Interview = {
  name: string;
  role: string;
  when: string;
  via: string;
  soon: boolean;
};
const INTERVIEWS: Interview[] = [
  { name: 'Aisyah Karim', role: 'Sales Executive', when: 'Today · 2:00pm', via: 'Zoom', soon: true },
  { name: 'Rajesh Kumar', role: 'Software Engineer', when: 'Tomorrow · 10:30am', via: 'Onsite', soon: true },
  { name: 'Nurul Huda', role: 'Account Manager', when: 'Thu · 3:00pm', via: 'Phone', soon: false },
];

type Candidate = {
  name: string;
  role: string;
  source: string;
  score: number;
};
const TOP_CANDIDATES: Candidate[] = [
  { name: 'Rajesh Kumar', role: 'Software Engineer', source: 'LinkedIn', score: 94 },
  { name: 'Aisyah Karim', role: 'Sales Executive', source: 'JobStreet', score: 90 },
  { name: 'Mei Ling Tan', role: 'Graphic Designer', source: 'Referral', score: 88 },
  { name: 'Faiz Rahman', role: 'Software Engineer', source: 'LinkedIn', score: 85 },
  { name: 'Siti Nurhaliza', role: 'Customer Support', source: 'Careers page', score: 82 },
];

const AGENTS = [
  { name: 'Resume Screener', active: true },
  { name: 'Interview Scheduler', active: true },
  { name: 'JD Writer', active: true },
  { name: 'Sourcing Bot', active: false },
];

const PROMPTS = [
  'Who to interview next?',
  'Pipeline for Sales Exec',
  'Time to hire',
  'Draft a JD for Software Engineer',
];

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

/* ------------------------------------------------------------------ */

export default function OverviewScreen() {
  return (
    <ScreenContainer>
      <BentoGrid>
        {/* Ask-Lekir hero */}
        <BentoCard tone="primary" className="col-span-2 md:col-span-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-primary-foreground/70">
                <Sparkles className="size-3.5 animate-twinkle" />
                Lekir · your recruiter co-pilot
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                Who should we hire next, Saudara?
              </h1>
              <p className="mt-1 text-xs text-primary-foreground/70">
                Careful and thorough about every hire. Powered by Taming Sari.
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
                Ask Lekir anything…
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
            label="Open roles"
            value="6"
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={[4, 4, 5, 5, 5, 6, 6, 6]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Candidates"
            value="248"
            delta="+6%"
            deltaTone="up"
            chart={<Sparkline data={[188, 202, 210, 221, 229, 236, 242, 248]} height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Interviews this week"
            value="9"
            delta="+3"
            deltaTone="up"
            chart={
              <Sparkline
                data={[5, 6, 6, 7, 8, 7, 9, 9]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Offers out"
            value="4"
            delta="+1"
            deltaTone="up"
            chart={
              <Sparkline
                data={[2, 2, 3, 3, 4, 3, 4, 4]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Applications trend + source mix */}
        <BentoCard
          title="Applications over time"
          subtitle="Last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={APPS_TREND} series={APPS_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Applications by source"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat data={SOURCE_MIX} height={240} centerValue="248" centerLabel="candidates" />
        </BentoCard>

        {/* Pipeline + AI recruiters + offer-accept */}
        <BentoCard
          title="Hiring pipeline"
          subtitle="Applied → hired"
          icon={Filter}
          className="col-span-2 md:col-span-4"
        >
          <FunnelFlow data={PIPELINE} height={200} />
        </BentoCard>
        <BentoCard
          title="AI recruiters"
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
        <BentoCard
          title="Offer-accept rate"
          subtitle="Last 90 days"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge
            value={78}
            label="accepted"
            valueLabel="78%"
            color="var(--chart-2)"
            height={200}
          />
        </BentoCard>

        {/* Upcoming interviews + top candidates */}
        <BentoCard
          title="Upcoming interviews"
          subtitle="Next on your calendar"
          icon={CalendarCheck}
          className="col-span-2 md:col-span-6"
        >
          <ul className="space-y-2">
            {INTERVIEWS.map((i) => (
              <li
                key={i.name}
                className="flex items-center gap-3 rounded-lg border bg-background/50 px-3 py-2"
              >
                <LiveDot active={i.soon} />
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(i.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{i.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{i.role}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium">{i.when}</p>
                  <p className="text-xs text-muted-foreground">{i.via}</p>
                </div>
              </li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard
          title="Top candidates"
          subtitle="Highest match score"
          icon={UserCheck}
          className="col-span-2 md:col-span-6"
        >
          <ul className="divide-y">
            {TOP_CANDIDATES.map((c) => (
              <li key={c.name} className="flex items-center gap-3 py-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(c.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.role} · {c.source}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Star className="size-3" />
                  {c.score}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
