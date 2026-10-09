import {
  AlertTriangle,
  ChartColumn,
  ClipboardCheck,
  Gauge,
  Radar,
  Trophy,
  Users,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  BarGroup,
  RadarSpread,
  Sparkline,
  type Series,
} from '@/components/charts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Scorecard = {
  name: string;
  department: string;
  overall: number;
  goals: number;
  attendance: number;
  peer: number;
};

const CARDS: Scorecard[] = [
  { name: 'Aisyah Rahim', department: 'Sales', overall: 88, goals: 85, attendance: 96, peer: 90 },
  { name: 'Ahmad Zaki', department: 'Finance', overall: 82, goals: 80, attendance: 92, peer: 85 },
  { name: 'Faiz Hakim', department: 'Operations', overall: 75, goals: 70, attendance: 95, peer: 80 },
  { name: 'Nurul Huda', department: 'Customer Support', overall: 91, goals: 90, attendance: 98, peer: 88 },
  { name: 'Siti Aminah', department: 'Marketing', overall: 64, goals: 55, attendance: 80, peer: 70 },
  { name: 'Lim Wei Jie', department: 'Engineering', overall: 78, goals: 75, attendance: 88, peer: 78 },
];

/* Competency spread — team average vs top quartile (out of 100). */
const COMPETENCIES = [
  { label: 'Goals', team: 76, top: 92 },
  { label: 'Attendance', team: 92, top: 98 },
  { label: 'Peer', team: 84, top: 94 },
  { label: 'Quality', team: 80, top: 93 },
  { label: 'Initiative', team: 74, top: 90 },
  { label: 'Leadership', team: 70, top: 88 },
];
const COMPETENCY_SERIES: Series[] = [
  { key: 'team', label: 'Team average', color: 'var(--chart-1)' },
  { key: 'top', label: 'Top quartile', color: 'var(--chart-2)' },
];

/* Average score by department (short labels for the horizontal axis). */
const BY_DEPT = [
  { label: 'Sales', score: 88 },
  { label: 'Finance', score: 82 },
  { label: 'Ops', score: 75 },
  { label: 'Support', score: 91 },
  { label: 'Mktg', score: 64 },
  { label: 'Eng', score: 78 },
];
const DEPT_SERIES: Series[] = [
  { key: 'score', label: 'Avg score', color: 'var(--chart-1)' },
];

function scoreColor(score: number) {
  if (score >= 80) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
  return 'bg-red-500/15 text-red-600 dark:text-red-400';
}

function ScorePill({ value }: { value: number }) {
  return (
    <span
      className={cn(
        'inline-flex min-w-9 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums',
        scoreColor(value),
      )}
    >
      {value}
    </span>
  );
}

export default function ScorecardScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Scorecards"
        subtitle="Team performance at a glance · H2 2026, Saudara."
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg score"
            value="80"
            delta="+3"
            onPrimary
            chart={
              <Sparkline
                data={[72, 74, 73, 76, 77, 78, 79, 80]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Reviews done"
            value="24 / 26"
            delta="92%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[14, 17, 19, 21, 22, 23, 24, 24]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Top performer" value="Nurul H." delta="91" deltaTone="up" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Needs coaching" value="2" delta="−1" deltaTone="up" />
        </BentoCard>

        {/* Competency radar + department bars */}
        <BentoCard
          title="Competencies"
          subtitle="Team average vs top quartile"
          icon={Radar}
          className="col-span-2 md:col-span-6"
        >
          <RadarSpread data={COMPETENCIES} series={COMPETENCY_SERIES} height={260} />
        </BentoCard>
        <BentoCard
          title="Scores by department"
          subtitle="Average overall score"
          icon={ChartColumn}
          className="col-span-2 md:col-span-6"
        >
          <BarGroup data={BY_DEPT} series={DEPT_SERIES} horizontal height={260} />
        </BentoCard>

        {/* Scorecard table */}
        <BentoCard
          title="Employee scorecards"
          subtitle="Goals · attendance · peer review"
          icon={Users}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Goals</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                  <TableHead className="text-right">Peer review</TableHead>
                  <TableHead className="text-right">Overall</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CARDS.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {c.name.charAt(0)}
                        </span>
                        <span className="whitespace-nowrap font-medium">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {c.department}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{c.goals}%</TableCell>
                    <TableCell className="text-right tabular-nums">{c.attendance}%</TableCell>
                    <TableCell className="text-right tabular-nums">{c.peer}%</TableCell>
                    <TableCell className="text-right">
                      <ScorePill value={c.overall} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Trophy className="size-4 text-emerald-600" /> Nurul Huda leads at 91
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-amber-600" /> 2 below target
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="size-4" /> avg 80
            </span>
            <span className="flex items-center gap-1.5">
              <ClipboardCheck className="size-4" /> 24 reviewed
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
