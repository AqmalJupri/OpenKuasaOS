import { BarChart3, Briefcase, PieChart, Plus, Search } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LiveDot } from '@/components/ui/live-dot';
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type JobStatus = 'Open' | 'Paused' | 'Closed' | 'Draft';

type Job = {
  title: string;
  dept: string;
  applicants: number;
  status: JobStatus;
  posted: string;
};

/** Source of truth — applicants sum to 248 = Total applicants. */
const JOBS: Job[] = [
  { title: 'Software Engineer', dept: 'Engineering', applicants: 56, status: 'Open', posted: '9d ago' },
  { title: 'Sales Executive', dept: 'Sales', applicants: 42, status: 'Open', posted: '12d ago' },
  { title: 'Account Manager', dept: 'Sales', applicants: 31, status: 'Open', posted: '15d ago' },
  { title: 'Graphic Designer', dept: 'Marketing', applicants: 28, status: 'Open', posted: '8d ago' },
  { title: 'Customer Support', dept: 'Operations', applicants: 24, status: 'Open', posted: '5d ago' },
  { title: 'Operations Executive', dept: 'Operations', applicants: 22, status: 'Open', posted: '6d ago' },
  { title: 'Content Writer', dept: 'Marketing', applicants: 27, status: 'Closed', posted: '32d ago' },
  { title: 'Accountant', dept: 'Finance', applicants: 18, status: 'Paused', posted: '30d ago' },
  { title: 'Marketing Lead', dept: 'Marketing', applicants: 0, status: 'Draft', posted: '—' },
];

/** Applicants by open role (short labels) — table carries the full titles. */
const APPLICANTS_BY_JOB = [
  { label: 'Software Eng', applicants: 56 },
  { label: 'Sales Exec', applicants: 42 },
  { label: 'Account Mgr', applicants: 31 },
  { label: 'Designer', applicants: 28 },
  { label: 'Support', applicants: 24 },
  { label: 'Ops Exec', applicants: 22 },
];
const APPLICANTS_SERIES: Series[] = [
  { key: 'applicants', label: 'Applicants', color: 'var(--chart-2)' },
];

/** Jobs by status — matches the counts in the table. */
const STATUS_MIX: Slice[] = [
  { key: 'open', label: 'Open', value: 6, color: 'var(--chart-1)' },
  { key: 'paused', label: 'Paused', value: 1, color: 'var(--chart-3)' },
  { key: 'closed', label: 'Closed', value: 1, color: 'var(--chart-4)' },
  { key: 'draft', label: 'Draft', value: 1, color: 'var(--chart-5)' },
];

const PILL: Record<JobStatus, string> = {
  Open: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Closed: 'bg-muted text-muted-foreground',
  Draft: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
};

/* ------------------------------------------------------------------ */

export default function JobsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Jobs"
        subtitle="Your open positions, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Post a Job
          </Button>
        }
      />

      <BentoGrid>
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
            label="Total applicants"
            value="248"
            delta="+6%"
            deltaTone="up"
            chart={<Sparkline data={[188, 202, 210, 221, 229, 236, 242, 248]} height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg time-to-fill"
            value="28d"
            delta="−3d"
            deltaTone="up"
            chart={
              <Sparkline
                data={[36, 35, 34, 33, 31, 30, 29, 28]}
                color="var(--chart-4)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Filled · YTD"
            value="9"
            delta="+2"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3, 4, 5, 6, 6, 7, 8, 9]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Applicants by job + status mix */}
        <BentoCard
          title="Applicants by job"
          subtitle="Open roles"
          icon={BarChart3}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={APPLICANTS_BY_JOB}
            series={APPLICANTS_SERIES}
            horizontal
            height={240}
          />
        </BentoCard>
        <BentoCard
          title="Jobs by status"
          subtitle="All postings"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat data={STATUS_MIX} height={240} centerValue="9" centerLabel="jobs" />
        </BentoCard>

        {/* Jobs table */}
        <BentoCard
          title="All jobs"
          subtitle="Positions & applicants"
          icon={Briefcase}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="flex flex-wrap items-center gap-2 px-4">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search jobs…" className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Applicants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {JOBS.map((job) => (
                  <TableRow key={job.title}>
                    <TableCell className="whitespace-nowrap font-medium">
                      <span className="flex items-center gap-2.5">
                        <LiveDot active={job.status === 'Open'} />
                        {job.title}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {job.dept}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {job.applicants}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                          PILL[job.status],
                        )}
                      >
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {job.posted}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-4 py-3 text-sm text-muted-foreground">
            Showing {JOBS.length} jobs · 248 applicants
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
