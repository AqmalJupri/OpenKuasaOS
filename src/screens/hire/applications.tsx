import { BarChart3, CircleDot, Inbox, PieChart } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd — applications) ----------- */

type Status = 'New' | 'In review' | 'Shortlisted' | 'Rejected';

const STATUS_STYLES: Record<Status, string> = {
  New: 'bg-primary/10 text-primary',
  'In review': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Shortlisted: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Rejected: 'bg-muted text-muted-foreground',
};

/** Period totals; the table below shows a recent sample. */
const TOTAL_APPLICATIONS = 128;

const STATUS_MIX: Slice[] = [
  { key: 'new', label: 'New', value: 24, color: 'var(--chart-1)' },
  { key: 'review', label: 'In review', value: 42, color: 'var(--chart-5)' },
  { key: 'shortlisted', label: 'Shortlisted', value: 18, color: 'var(--chart-2)' },
  { key: 'rejected', label: 'Rejected', value: 44, color: 'var(--chart-4)' },
];

const BY_JOB = [
  { label: 'Sales Exec', count: 34 },
  { label: 'Software Eng', count: 28 },
  { label: 'Acct Manager', count: 19 },
  { label: 'Operations', count: 22 },
  { label: 'Designer', count: 14 },
  { label: 'Support', count: 11 },
];
const BY_JOB_SERIES: Series[] = [
  { key: 'count', label: 'Applications', color: 'var(--chart-2)' },
];

type Application = {
  id: string;
  name: string;
  job: string;
  source: string;
  status: Status;
  applied: string;
};

const ROWS: Application[] = [
  { id: 'a1', name: 'Aisyah Rahim', job: 'Sales Executive', source: 'JobStreet', status: 'New', applied: '08 Oct 2026' },
  { id: 'a2', name: 'Faiz Hakim', job: 'Product Designer', source: 'LinkedIn', status: 'New', applied: '08 Oct 2026' },
  { id: 'a3', name: 'Mei Ling Tan', job: 'Software Engineer', source: 'Referral', status: 'In review', applied: '06 Oct 2026' },
  { id: 'a4', name: 'Nurul Huda', job: 'Account Manager', source: 'JobStreet', status: 'In review', applied: '05 Oct 2026' },
  { id: 'a5', name: 'Lim Wei Jie', job: 'Operations', source: 'Referral', status: 'Shortlisted', applied: '03 Oct 2026' },
  { id: 'a6', name: 'Siti Aminah', job: 'Customer Support', source: 'Careers page', status: 'In review', applied: '04 Oct 2026' },
  { id: 'a7', name: 'Rajesh Kumar', job: 'Software Engineer', source: 'LinkedIn', status: 'Shortlisted', applied: '28 Sep 2026' },
  { id: 'a8', name: 'Ahmad Zaki', job: 'Operations', source: 'Careers page', status: 'Rejected', applied: '27 Sep 2026' },
  { id: 'a9', name: 'Nabila Idris', job: 'Product Designer', source: 'JobStreet', status: 'Shortlisted', applied: '30 Sep 2026' },
  { id: 'a10', name: 'Hafiz Omar', job: 'Sales Executive', source: 'LinkedIn', status: 'Rejected', applied: '26 Sep 2026' },
];

const isActive = (status: Status) =>
  status === 'New' || status === 'In review';

export default function ApplicationsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Applications"
        subtitle="All incoming applications across your open roles, Saudara."
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total applications"
            value={TOTAL_APPLICATIONS}
            delta="+16%"
            onPrimary
            chart={
              <Sparkline
                data={[78, 86, 94, 101, 110, 118, 123, TOTAL_APPLICATIONS]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="New"
            value="24"
            delta="+9"
            deltaTone="up"
            chart={
              <Sparkline
                data={[11, 14, 13, 18, 16, 21, 22, 24]}
                color="var(--chart-1)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="In review"
            value="42"
            delta="+6"
            deltaTone="up"
            chart={
              <Sparkline
                data={[28, 31, 33, 35, 37, 39, 40, 42]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Rejected"
            value="44"
            delta="+4"
            deltaTone="down"
            chart={
              <Sparkline
                data={[31, 33, 35, 37, 39, 41, 43, 44]}
                color="var(--chart-4)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Status donut + applications by job */}
        <BentoCard
          title="By status"
          subtitle="Current application mix"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={STATUS_MIX}
            height={240}
            centerValue={TOTAL_APPLICATIONS.toString()}
            centerLabel="applications"
          />
        </BentoCard>
        <BentoCard
          title="Applications by job"
          subtitle="Open roles"
          icon={BarChart3}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={BY_JOB}
            series={BY_JOB_SERIES}
            horizontal
            height={240}
          />
        </BentoCard>

        {/* Applications table */}
        <BentoCard
          title="Recent applications"
          subtitle="Most recent first"
          icon={Inbox}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LiveDot active={isActive(r.status)} />
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {r.name.charAt(0)}
                        </span>
                        <span className="whitespace-nowrap font-medium">
                          {r.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{r.job}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.source}</Badge>
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
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {r.applied}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>
              Showing {ROWS.length} of {TOTAL_APPLICATIONS} applications
            </span>
            <span className="flex items-center gap-2">
              <CircleDot className="size-4" />
              24 new
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
