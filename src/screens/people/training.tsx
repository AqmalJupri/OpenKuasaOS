import {
  BookOpen,
  ChartColumn,
  CircleCheck,
  Clock,
  GraduationCap,
  PieChart,
  Plus,
  Users,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  BarGroup,
  DonutStat,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Status = 'Completed' | 'In progress' | 'Upcoming';

type Training = {
  title: string;
  short: string;
  category: string;
  status: Status;
  date: string;
  enrolled: number;
  completed: number;
  hours: number;
};

const TRAININGS: Training[] = [
  { title: 'Sales Bootcamp', short: 'Sales', category: 'Sales', status: 'In progress', date: '12 Oct', enrolled: 8, completed: 3, hours: 16 },
  { title: 'Fire Safety Drill', short: 'Fire Safety', category: 'Compliance', status: 'Upcoming', date: '18 Oct', enrolled: 24, completed: 0, hours: 3 },
  { title: 'Excel for Finance', short: 'Excel', category: 'Technical', status: 'Completed', date: '28 Sep', enrolled: 6, completed: 6, hours: 8 },
  { title: 'Leadership 101', short: 'Leadership', category: 'Leadership', status: 'In progress', date: '25 Oct', enrolled: 5, completed: 2, hours: 12 },
  { title: 'Customer Service Essentials', short: 'CS Basics', category: 'Service', status: 'Completed', date: '20 Sep', enrolled: 12, completed: 12, hours: 6 },
  { title: 'LHDN e-Invois Training', short: 'e-Invois', category: 'Compliance', status: 'Completed', date: '15 Sep', enrolled: 9, completed: 9, hours: 4 },
  { title: 'Cybersecurity Awareness', short: 'Cyber', category: 'Technical', status: 'In progress', date: '22 Oct', enrolled: 18, completed: 7, hours: 5 },
  { title: 'Bahasa Workplace Comms', short: 'Bahasa', category: 'Service', status: 'Upcoming', date: '30 Oct', enrolled: 10, completed: 0, hours: 6 },
];

/* Enrolled vs completed, by course (short labels for the axis). */
const COMPLETION = TRAININGS.map((t) => ({
  label: t.short,
  enrolled: t.enrolled,
  completed: t.completed,
}));
const COMPLETION_SERIES: Series[] = [
  { key: 'enrolled', label: 'Enrolled', color: 'var(--chart-1)' },
  { key: 'completed', label: 'Completed', color: 'var(--chart-2)' },
];

/** Enrolments by category (sums to 92 across 5 categories). */
const CATEGORY_MIX: Slice[] = [
  { key: 'compliance', label: 'Compliance', value: 33, color: 'var(--chart-1)' },
  { key: 'technical', label: 'Technical', value: 24, color: 'var(--chart-2)' },
  { key: 'service', label: 'Service', value: 22, color: 'var(--chart-3)' },
  { key: 'sales', label: 'Sales', value: 8, color: 'var(--chart-4)' },
  { key: 'leadership', label: 'Leadership', value: 5, color: 'var(--chart-5)' },
];

const STATUS_PILL: Record<Status, string> = {
  Completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  'In progress': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Upcoming: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: Status }) {
  return (
    <span className="flex items-center gap-2">
      <LiveDot active={status === 'In progress'} />
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          STATUS_PILL[status],
        )}
      >
        {status}
      </span>
    </span>
  );
}

export default function TrainingScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Training"
        subtitle="Courses and sessions for your team, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Training
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Courses"
            value="8"
            delta="+2"
            onPrimary
            chart={
              <Sparkline
                data={[3, 4, 5, 5, 6, 7, 8, 8]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Enrolled"
            value="92"
            delta="+10"
            deltaTone="up"
            chart={
              <Sparkline
                data={[40, 52, 60, 68, 75, 82, 88, 92]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Completed"
            value="39"
            delta="+15%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[12, 18, 24, 28, 31, 35, 38, 39]}
                color="var(--chart-1)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Training hours"
            value="60"
            delta="+12"
            deltaTone="up"
            chart={
              <Sparkline
                data={[28, 34, 40, 46, 50, 54, 58, 60]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Completion by course + category mix */}
        <BentoCard
          title="Completion by course"
          subtitle="Enrolled vs completed"
          icon={ChartColumn}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={COMPLETION}
            series={COMPLETION_SERIES}
            horizontal
            height={260}
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="Enrolments by category"
          subtitle="Across all courses"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={CATEGORY_MIX}
            height={260}
            centerValue="92"
            centerLabel="enrolled"
          />
        </BentoCard>

        {/* Training table */}
        <BentoCard
          title="All training"
          subtitle="Courses, enrolment and progress"
          icon={BookOpen}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-right">Enrolled</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TRAININGS.map((t) => (
                  <TableRow key={t.title}>
                    <TableCell className="whitespace-nowrap font-medium">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <GraduationCap className="size-4" />
                        </span>
                        {t.title}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {t.category}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {t.date}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{t.enrolled}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {t.completed} / {t.enrolled}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{t.hours}</TableCell>
                    <TableCell>
                      <StatusPill status={t.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> 92 enrolled
            </span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="size-4 text-emerald-600" /> 39 completed
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Clock className="size-4 text-amber-600" /> 3 in progress
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
