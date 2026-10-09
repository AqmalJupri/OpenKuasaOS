import {
  Briefcase,
  Copy,
  Filter,
  Globe,
  Palette,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  DonutStat,
  FunnelFlow,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

const VIEWS_TREND = [
  { label: 'Wk1', views: 420, applies: 12 },
  { label: 'Wk2', views: 460, applies: 13 },
  { label: 'Wk3', views: 510, applies: 15 },
  { label: 'Wk4', views: 540, applies: 16 },
  { label: 'Wk5', views: 560, applies: 17 },
  { label: 'Wk6', views: 580, applies: 18 },
  { label: 'Wk7', views: 600, applies: 18 },
  { label: 'Wk8', views: 610, applies: 19 },
];
const VIEWS_SERIES: Series[] = [
  { key: 'views', label: 'Views', color: 'var(--chart-1)' },
  { key: 'applies', label: 'Applies', color: 'var(--chart-2)' },
];

/* Views → applies funnel (top = page views, 2nd = applies ⇒ 3.0%) ---- */
const FUNNEL: Slice[] = [
  { key: 'views', label: 'Views', value: 4280, color: 'var(--chart-1)' },
  { key: 'applies', label: 'Applies', value: 128, color: 'var(--chart-2)' },
  { key: 'interviews', label: 'Interviews', value: 42, color: 'var(--chart-5)' },
  { key: 'hires', label: 'Hires', value: 8, color: 'var(--chart-3)' },
];

/* Applies by source — sums to the 128 applies ------------------------ */
const APPLY_SOURCE: Slice[] = [
  { key: 'jobstreet', label: 'JobStreet', value: 46, color: 'var(--chart-1)' },
  { key: 'linkedin', label: 'LinkedIn', value: 38, color: 'var(--chart-2)' },
  { key: 'referral', label: 'Referral', value: 22, color: 'var(--chart-5)' },
  { key: 'direct', label: 'Direct', value: 14, color: 'var(--chart-3)' },
  { key: 'other', label: 'Other', value: 8, color: 'var(--chart-4)' },
];

type JobStatus = 'Published' | 'Closed' | 'Draft';

type Job = {
  title: string;
  location: string;
  type: string;
  applicants: number;
  status: JobStatus;
};

const JOBS: Job[] = [
  {
    title: 'Software Engineer',
    location: 'Kuala Lumpur',
    type: 'Full-time',
    applicants: 38,
    status: 'Published',
  },
  {
    title: 'Sales Executive',
    location: 'Petaling Jaya',
    type: 'Full-time',
    applicants: 27,
    status: 'Published',
  },
  {
    title: 'Account Manager',
    location: 'Shah Alam',
    type: 'Full-time',
    applicants: 22,
    status: 'Published',
  },
  {
    title: 'Operations Executive',
    location: 'Klang',
    type: 'Contract',
    applicants: 16,
    status: 'Published',
  },
  {
    title: 'Senior Product Designer',
    location: 'Kuala Lumpur · Remote',
    type: 'Full-time',
    applicants: 25,
    status: 'Published',
  },
  {
    title: 'Customer Support Officer',
    location: 'Cyberjaya',
    type: 'Part-time',
    applicants: 10,
    status: 'Closed',
  },
  {
    title: 'Finance Executive',
    location: 'Subang Jaya',
    type: 'Full-time',
    applicants: 0,
    status: 'Draft',
  },
];

const OPEN_ROLES = JOBS.filter((j) => j.status === 'Published').length;

const STATUS_TONE: Record<JobStatus, string> = {
  Published: 'text-emerald-600 dark:text-emerald-400',
  Closed: 'text-muted-foreground',
  Draft: 'text-amber-600 dark:text-amber-400',
};

/* ------------------------------------------------------------------ */

export default function CareersPageScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Careers Page"
        subtitle="Your public job board, Saudara."
        actions={
          <>
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button size="sm">Publish</Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Page views"
            value="4,280"
            delta="+12%"
            onPrimary
            chart={
              <Sparkline
                data={[420, 460, 510, 540, 560, 580, 600, 610]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Applies"
            value="128"
            delta="+18"
            deltaTone="up"
            chart={
              <Sparkline
                data={[12, 13, 15, 16, 17, 18, 18, 19]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Conversion"
            value="3.0%"
            delta="+0.4pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[2.6, 2.7, 2.8, 2.8, 2.9, 2.9, 3.0, 3.0]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Open roles"
            value={OPEN_ROLES.toString()}
            delta="+1"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3, 3, 4, 4, 4, 5, 5, 5]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Live page preview (browser frame) */}
        <BentoCard
          title="Careers page"
          subtitle="Published · updated 2 days ago"
          icon={Globe}
          action={
            <Button variant="outline" size="sm">
              <Copy className="size-4" />
              Copy link
            </Button>
          }
          className="col-span-2 md:col-span-4"
        >
          <div className="flex h-[240px] items-center justify-center">
            <div className="w-full max-w-[240px] overflow-hidden rounded-xl border bg-background shadow-sm">
              <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
                <span className="size-2 rounded-full bg-red-400/70" />
                <span className="size-2 rounded-full bg-amber-400/70" />
                <span className="size-2 rounded-full bg-emerald-400/70" />
                <span className="ml-2 truncate text-[10px] text-muted-foreground">
                  careers.openkuasa.com
                </span>
              </div>
              <div className="flex flex-col gap-2 bg-gradient-to-br from-primary/10 to-muted px-4 py-5">
                <span className="w-fit rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Rimba Ventures
                </span>
                <p className="text-sm font-bold leading-tight">Join our team</p>
                <p className="text-[10px] text-muted-foreground">
                  Build the future with us
                </p>
                <div className="mt-1 space-y-1.5">
                  {JOBS.filter((j) => j.status === 'Published')
                    .slice(0, 3)
                    .map((j) => (
                      <div
                        key={j.title}
                        className="flex items-center justify-between rounded-md border bg-background/70 px-2 py-1"
                      >
                        <span className="truncate text-[10px] font-medium">
                          {j.title}
                        </span>
                        <span className="shrink-0 text-[9px] text-muted-foreground">
                          {j.location.split(' · ')[0]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Views & applies trend */}
        <BentoCard
          title="Views & applies over time"
          subtitle="Last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={VIEWS_TREND} series={VIEWS_SERIES} height={240} showLegend />
        </BentoCard>

        {/* Funnel + applies source + branding */}
        <BentoCard
          title="Views → applies → hires"
          subtitle="Careers page funnel"
          icon={Filter}
          className="col-span-2 md:col-span-4"
        >
          <FunnelFlow data={FUNNEL} height={200} />
        </BentoCard>
        <BentoCard
          title="Applies by source"
          subtitle="This period"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={APPLY_SOURCE}
            height={200}
            centerValue="128"
            centerLabel="applies"
          />
        </BentoCard>
        <BentoCard
          title="Page branding"
          subtitle="How your page looks"
          icon={Palette}
          className="col-span-2 md:col-span-4"
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" defaultValue="Join our team" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" defaultValue="Build the future with us" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="primary-colour">Primary colour</Label>
              <Input id="primary-colour" defaultValue="#2E8B57" />
            </div>
          </div>
        </BentoCard>

        {/* Job listings table */}
        <BentoCard
          title="Job listings"
          subtitle={`${OPEN_ROLES} published · ${JOBS.length} total`}
          icon={Briefcase}
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Applicants</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {JOBS.map((j) => (
                  <TableRow key={j.title}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {j.title}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {j.location}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{j.type}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {j.applicants > 0 ? j.applicants : '—'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 text-sm font-medium',
                          STATUS_TONE[j.status],
                        )}
                      >
                        <LiveDot active={j.status === 'Published'} />
                        {j.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
