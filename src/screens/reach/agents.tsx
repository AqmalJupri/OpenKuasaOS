import {
  BarChart3,
  FileBarChart,
  FlaskConical,
  Gauge,
  MessageSquare,
  Plus,
  Radar,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  BarGroup,
  RadarSpread,
  RadialGauge,
  Sparkline,
  type Series,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type Agent = {
  name: string;
  role: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
  lastRun: string;
  tasks: number;
  trend: number[];
  color: string;
};

const AGENTS: Agent[] = [
  {
    name: 'Lead Qualifier',
    role: 'Scores & routes inbound leads',
    description: 'Ranks every new enquiry and sends hot leads to Aisyah first.',
    icon: Target,
    active: true,
    lastRun: '4 min ago',
    tasks: 428,
    trend: [48, 52, 46, 60, 58, 64, 72],
    color: 'var(--chart-1)',
  },
  {
    name: 'Ad Optimizer',
    role: 'Shifts budget to winning ads',
    description: 'Moves daily spend from weak ads to top performers in RM.',
    icon: TrendingUp,
    active: true,
    lastRun: '12 min ago',
    tasks: 264,
    trend: [30, 34, 28, 40, 38, 44, 46],
    color: 'var(--chart-2)',
  },
  {
    name: 'Follow-up Writer',
    role: 'Drafts WhatsApp follow-ups',
    description: 'Writes warm, on-brand replies for leads that went quiet.',
    icon: MessageSquare,
    active: true,
    lastRun: '26 min ago',
    tasks: 312,
    trend: [36, 40, 38, 44, 48, 50, 54],
    color: 'var(--chart-5)',
  },
  {
    name: 'Audience Finder',
    role: 'Builds lookalike audiences',
    description: 'Finds new buyers who look like your best repeat customers.',
    icon: Users,
    active: false,
    lastRun: '3 days ago',
    tasks: 60,
    trend: [12, 10, 9, 8, 7, 6, 5],
    color: 'var(--chart-3)',
  },
  {
    name: 'Creative Tester',
    role: 'A/B tests ad creatives',
    description: 'Runs headline and image variants and keeps the winner.',
    icon: FlaskConical,
    active: true,
    lastRun: '1h ago',
    tasks: 148,
    trend: [18, 22, 20, 26, 24, 28, 30],
    color: 'var(--chart-4)',
  },
  {
    name: 'Report Builder',
    role: 'Weekly performance digest',
    description: 'Sends Faiz a clear weekly summary of spend, leads and ROI.',
    icon: FileBarChart,
    active: false,
    lastRun: '2 days ago',
    tasks: 72,
    trend: [9, 8, 10, 7, 9, 8, 7],
    color: 'var(--chart-3)',
  },
];

const AUTOMATION_TREND = [
  { label: 'Wk1', automated: 118, manual: 96 },
  { label: 'Wk2', automated: 142, manual: 88 },
  { label: 'Wk3', automated: 156, manual: 82 },
  { label: 'Wk4', automated: 171, manual: 74 },
  { label: 'Wk5', automated: 188, manual: 66 },
  { label: 'Wk6', automated: 204, manual: 61 },
  { label: 'Wk7', automated: 226, manual: 54 },
  { label: 'Wk8', automated: 248, manual: 49 },
];
const AUTOMATION_SERIES: Series[] = [
  { key: 'automated', label: 'Automated', color: 'var(--chart-1)' },
  { key: 'manual', label: 'Manual', color: 'var(--chart-3)' },
];

const TASKS_BY_AGENT = [
  { label: 'Lead Qualifier', tasks: 428 },
  { label: 'Follow-up Writer', tasks: 312 },
  { label: 'Ad Optimizer', tasks: 264 },
  { label: 'Creative Tester', tasks: 148 },
  { label: 'Report Builder', tasks: 72 },
  { label: 'Audience Finder', tasks: 60 },
];
const TASKS_SERIES: Series[] = [
  { key: 'tasks', label: 'Tasks', color: 'var(--chart-1)' },
];

const AGENT_STRENGTHS = [
  { label: 'Speed', qualifier: 92, optimizer: 78 },
  { label: 'Accuracy', qualifier: 88, optimizer: 95 },
  { label: 'Volume', qualifier: 96, optimizer: 64 },
  { label: 'Coverage', qualifier: 74, optimizer: 82 },
  { label: 'Reliability', qualifier: 90, optimizer: 86 },
];
const STRENGTHS_SERIES: Series[] = [
  { key: 'qualifier', label: 'Lead Qualifier', color: 'var(--chart-1)' },
  { key: 'optimizer', label: 'Ad Optimizer', color: 'var(--chart-2)' },
];

/* ------------------------------------------------------------------ */

export default function AgentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="AI Agents"
        subtitle="Your always-on marketing crew."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Agent
          </Button>
        }
      />
      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Active agents"
            value="4 / 6"
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={[2, 3, 3, 4, 4, 5, 4]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Tasks automated"
            value="1,284"
            delta="+18%"
            deltaTone="up"
            chart={<Sparkline data={[120, 150, 140, 180, 190, 210, 230]} height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Hours saved"
            value="36h"
            delta="+9%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[18, 22, 24, 27, 30, 33, 36]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg success rate"
            value="94%"
            delta="+2pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[89, 90, 91, 92, 93, 93, 94]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Automation trend + coverage gauge */}
        <BentoCard
          title="Automated vs manual"
          subtitle="Tasks handled · last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend
            data={AUTOMATION_TREND}
            series={AUTOMATION_SERIES}
            height={240}
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="Automation coverage"
          subtitle="Workflows on autopilot"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge value={78} label="covered" valueLabel="78%" height={240} />
        </BentoCard>

        {/* Tasks by agent + strengths radar */}
        <BentoCard
          title="Tasks by agent"
          subtitle="Completed this month"
          icon={BarChart3}
          className="col-span-2 md:col-span-7"
        >
          <BarGroup data={TASKS_BY_AGENT} series={TASKS_SERIES} horizontal height={240} />
        </BentoCard>
        <BentoCard
          title="Agent strengths"
          subtitle="Speed · accuracy · volume"
          icon={Radar}
          className="col-span-2 md:col-span-5"
        >
          <RadarSpread data={AGENT_STRENGTHS} series={STRENGTHS_SERIES} height={240} />
        </BentoCard>

        {/* Agent roster */}
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          return (
            <BentoCard key={agent.name} className="col-span-2 md:col-span-4">
              <div className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold leading-tight">
                        {agent.name}
                      </h3>
                      <p className="truncate text-xs text-muted-foreground">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
                      agent.active
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <LiveDot active={agent.active} />
                    {agent.active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {agent.description}
                </p>
                <div className="mt-auto rounded-lg bg-muted/40 p-2">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>7-day activity</span>
                    <span className="tabular-nums">{agent.tasks} tasks</span>
                  </div>
                  <Sparkline
                    data={agent.trend}
                    color={agent.active ? agent.color : 'var(--muted-foreground)'}
                    height={34}
                  />
                </div>
                <div className="flex items-center justify-between pt-0.5 text-xs text-muted-foreground">
                  <span>Last run · {agent.lastRun}</span>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </BentoCard>
          );
        })}
      </BentoGrid>
    </ScreenContainer>
  );
}
