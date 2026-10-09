import {
  BarChart3,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  MapPin,
  Phone,
  Plus,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { BarGroup, Sparkline, type Series } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Badge } from '@/components/ui/badge';
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

/* ---- mock data (Rimba Ventures Sdn Bhd — interviews) ------------- */

type Status = 'Scheduled' | 'Completed' | 'No-show';
type InterviewType = 'Video' | 'Onsite' | 'Phone';

const STATUS_STYLES: Record<Status, string> = {
  Scheduled: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Completed: 'bg-muted text-muted-foreground',
  'No-show': 'bg-red-500/15 text-red-600 dark:text-red-400',
};

const TYPE_ICONS: Record<InterviewType, LucideIcon> = {
  Video,
  Onsite: MapPin,
  Phone,
};

type Interview = {
  id: string;
  name: string;
  role: string;
  date: string;
  time: string;
  interviewer: string;
  type: InterviewType;
  status: Status;
};

const ROWS: Interview[] = [
  { id: 'i1', name: 'Lim Wei Jie', role: 'Operations', date: '09 Oct', time: '10:00', interviewer: 'Ahmad Zaki', type: 'Onsite', status: 'Scheduled' },
  { id: 'i2', name: 'Nabila Idris', role: 'Product Designer', date: '09 Oct', time: '14:00', interviewer: 'Faiz Hakim', type: 'Video', status: 'Scheduled' },
  { id: 'i3', name: 'Nurul Huda', role: 'Account Manager', date: '10 Oct', time: '11:30', interviewer: 'Siti Aminah', type: 'Video', status: 'Scheduled' },
  { id: 'i4', name: 'Hafiz Omar', role: 'Sales Executive', date: '10 Oct', time: '16:00', interviewer: 'Aisyah Rahim', type: 'Onsite', status: 'Scheduled' },
  { id: 'i5', name: 'Chong Ai Wei', role: 'Account Manager', date: '13 Oct', time: '09:00', interviewer: 'Saudara', type: 'Video', status: 'Scheduled' },
  { id: 'i6', name: 'Rajesh Nair', role: 'Sales Executive', date: '14 Oct', time: '15:30', interviewer: 'Nurul Huda', type: 'Onsite', status: 'Scheduled' },
  { id: 'i7', name: 'Rajesh Kumar', role: 'Software Engineer', date: '07 Oct', time: '11:00', interviewer: 'Saudara', type: 'Video', status: 'Completed' },
  { id: 'i8', name: 'Wong Li Fen', role: 'Customer Support', date: '06 Oct', time: '15:00', interviewer: 'Aisyah Rahim', type: 'Onsite', status: 'Completed' },
  { id: 'i9', name: 'Siti Aminah', role: 'Customer Support', date: '06 Oct', time: '09:30', interviewer: 'Faiz Hakim', type: 'Phone', status: 'Completed' },
  { id: 'i10', name: 'Ahmad Zaki', role: 'Operations', date: '03 Oct', time: '14:00', interviewer: 'Nurul Huda', type: 'Video', status: 'No-show' },
];

/* Interviews booked per weekday — current week (Mon–Fri). */
const WEEK_LOAD = [
  { label: 'Mon', count: 2 },
  { label: 'Tue', count: 1 },
  { label: 'Wed', count: 0 },
  { label: 'Thu', count: 2 },
  { label: 'Fri', count: 2 },
];
const WEEK_SERIES: Series[] = [
  { key: 'count', label: 'Interviews', color: 'var(--chart-1)' },
];

const scheduled = ROWS.filter((r) => r.status === 'Scheduled');
const completedCount = ROWS.filter((r) => r.status === 'Completed').length;
const noShowCount = ROWS.filter((r) => r.status === 'No-show').length;
const thisWeek = WEEK_LOAD.reduce((sum, d) => sum + d.count, 0);

function UpcomingRow({ interview }: { interview: Interview }) {
  const TypeIcon = TYPE_ICONS[interview.type];
  return (
    <li className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-colors hover:border-primary/40">
      <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-primary/10 px-2 py-1 text-primary">
        <span className="text-[10px] font-medium uppercase">
          {interview.date.split(' ')[1]}
        </span>
        <span className="text-base font-bold leading-none tabular-nums">
          {interview.date.split(' ')[0]}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <LiveDot active />
          <p className="truncate text-sm font-semibold">{interview.name}</p>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {interview.role} · {interview.interviewer}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold tabular-nums">
          {interview.time}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          <TypeIcon className="size-3" />
          {interview.type}
        </span>
      </div>
    </li>
  );
}

export default function InterviewsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Interviews"
        subtitle="Your upcoming and recent interviews, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Schedule Interview
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Scheduled"
            value={scheduled.length}
            delta="+3"
            onPrimary
            chart={
              <Sparkline
                data={[2, 3, 3, 4, 4, 5, 5, scheduled.length]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="This week"
            value={thisWeek}
            delta="+2"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3, 4, 4, 5, 6, 6, 7, thisWeek]}
                color="var(--chart-1)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Completed"
            value={completedCount}
            delta="+1"
            deltaTone="up"
            chart={
              <Sparkline
                data={[1, 1, 2, 2, 2, 3, 3, completedCount]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="No-shows"
            value={noShowCount}
            delta="0"
            deltaTone="flat"
            chart={
              <Sparkline
                data={[1, 0, 1, 0, 0, 1, 0, noShowCount]}
                color="var(--chart-4)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Upcoming list + week load */}
        <BentoCard
          title="Upcoming interviews"
          subtitle={`${scheduled.length} scheduled`}
          icon={CalendarClock}
          className="col-span-2 md:col-span-8"
        >
          <ul className="space-y-2">
            {scheduled.map((interview) => (
              <UpcomingRow key={interview.id} interview={interview} />
            ))}
          </ul>
        </BentoCard>
        <BentoCard
          title="This week"
          subtitle="Interviews by day"
          icon={BarChart3}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup data={WEEK_LOAD} series={WEEK_SERIES} height={240} />
        </BentoCard>

        {/* All interviews table */}
        <BentoCard
          title="All interviews"
          subtitle="Upcoming first"
          icon={CalendarDays}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LiveDot active={r.status === 'Scheduled'} />
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {r.name.charAt(0)}
                        </span>
                        <span className="whitespace-nowrap font-medium">
                          {r.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{r.role}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {r.time}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {r.interviewer}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          STATUS_STYLES[r.status],
                        )}
                      >
                        {r.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>Showing {ROWS.length} interviews</span>
            <span className="flex items-center gap-2">
              <CalendarCheck className="size-4" />
              {completedCount} completed
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
