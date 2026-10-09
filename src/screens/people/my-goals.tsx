import {
  AlertTriangle,
  CircleCheck,
  Flag,
  Gauge,
  Plus,
  Target,
  TrendingUp,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { BarGroup, RadialGauge, Sparkline, type Series } from '@/components/charts';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/* ---- mock data (Saudara · Q4 2026) -------------------------------- */

type GoalStatus = 'On track' | 'At risk' | 'Done';

type Goal = {
  title: string;
  label: string;
  description: string;
  progress: number;
  status: GoalStatus;
  due: string;
};

const GOALS: Goal[] = [
  {
    title: 'Close 20 enterprise deals',
    label: 'Deals',
    description: 'Convert qualified enterprise pipeline into signed contracts by year end.',
    progress: 65,
    status: 'On track',
    due: '31 Dec 2026',
  },
  {
    title: 'Improve CSAT to 90%',
    label: 'CSAT',
    description: 'Raise customer satisfaction through faster response and follow-up.',
    progress: 80,
    status: 'On track',
    due: '31 Dec 2026',
  },
  {
    title: 'Launch referral program',
    label: 'Referral',
    description: 'Roll out a customer referral programme with tracked rewards.',
    progress: 30,
    status: 'At risk',
    due: '30 Nov 2026',
  },
  {
    title: 'Complete sales certification',
    label: 'Cert',
    description: 'Finish the internal sales enablement certification track.',
    progress: 100,
    status: 'Done',
    due: '15 Sep 2026',
  },
];

const STATUS_STYLES: Record<GoalStatus, string> = {
  'On track': 'bg-emerald-500/15 text-emerald-600',
  'At risk': 'bg-amber-500/15 text-amber-600',
  Done: 'bg-sky-500/15 text-sky-600',
};

const onTrack = GOALS.filter((g) => g.status === 'On track').length;
const atRisk = GOALS.filter((g) => g.status === 'At risk').length;
const completion = Math.round(
  GOALS.reduce((sum, g) => sum + g.progress, 0) / GOALS.length,
);

/* KPI sparkline trends (last 6 periods) ------------------------------ */
const SPARK_GOALS = [2, 3, 3, 4, 4, 4];
const SPARK_ONTRACK = [1, 1, 2, 2, 3, 2];
const SPARK_ATRISK = [0, 1, 1, 2, 1, 1];
const SPARK_COMPLETION = [48, 52, 58, 61, 65, 69];

const PROGRESS_BY_GOAL = GOALS.map((g) => ({ label: g.label, progress: g.progress }));
const PROGRESS_SERIES: Series[] = [
  { key: 'progress', label: 'Progress %', color: 'var(--chart-1)' },
];

function StatusPill({ status }: { status: GoalStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function MyGoalsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="My Goals"
        subtitle="Your objectives this quarter, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Add Goal
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Goals"
            value={GOALS.length}
            delta="this quarter"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline data={SPARK_GOALS} color="var(--primary-foreground)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="On track"
            value={onTrack}
            delta="healthy"
            deltaTone="up"
            chart={<Sparkline data={SPARK_ONTRACK} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="At risk"
            value={atRisk}
            delta="needs focus"
            deltaTone="down"
            chart={<Sparkline data={SPARK_ATRISK} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Completion"
            value={`${completion}%`}
            delta="+6%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_COMPLETION} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>

        {/* Overall gauge + per-goal progress bars */}
        <BentoCard
          title="Overall progress"
          subtitle="Average across your goals"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge
            value={completion}
            valueLabel={`${completion}%`}
            label="complete"
            color="var(--chart-1)"
            height={220}
          />
        </BentoCard>
        <BentoCard
          title="Progress by goal"
          subtitle="Completion per objective"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={PROGRESS_BY_GOAL}
            series={PROGRESS_SERIES}
            horizontal
            height={220}
          />
        </BentoCard>

        {/* Per-goal cards */}
        {GOALS.map((g) => (
          <BentoCard
            key={g.title}
            title={g.title}
            icon={g.status === 'Done' ? CircleCheck : g.status === 'At risk' ? AlertTriangle : Target}
            action={<StatusPill status={g.status} />}
            className="col-span-2 md:col-span-6"
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{g.description}</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold tabular-nums">{g.progress}%</span>
                </div>
                <Progress value={g.progress} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flag className="size-3.5" />
                <span>Due {g.due}</span>
              </div>
            </div>
          </BentoCard>
        ))}
      </BentoGrid>
    </ScreenContainer>
  );
}
