import {
  BarChart3,
  ChevronDown,
  Filter,
  MapPin,
  PieChart,
  Plus,
  Search,
  Star,
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
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type Status = 'Available' | 'Shortlisted' | 'Passive' | 'Re-engaged';

type Candidate = {
  name: string;
  title: string;
  skills: string[];
  location: string;
  source: string;
  rating: number;
  status: Status;
};

/** Total saved candidates in the pool; the table shows a recent sample. */
const POOL_SIZE = 342;

const CANDIDATES: Candidate[] = [
  {
    name: 'Aisyah Rahman',
    title: 'Software Engineer',
    skills: ['React', 'Node.js', 'TypeScript'],
    location: 'Kuala Lumpur',
    source: 'LinkedIn',
    rating: 4.8,
    status: 'Shortlisted',
  },
  {
    name: 'Faiz Hakim',
    title: 'Sales Executive',
    skills: ['B2B Sales', 'CRM'],
    location: 'Petaling Jaya',
    source: 'JobStreet',
    rating: 4.2,
    status: 'Available',
  },
  {
    name: 'Nurul Huda',
    title: 'Account Manager',
    skills: ['Key Accounts', 'Negotiation'],
    location: 'Shah Alam',
    source: 'Referral',
    rating: 4.5,
    status: 'Available',
  },
  {
    name: 'Ahmad Zaki',
    title: 'Operations Executive',
    skills: ['Logistics', 'Excel', 'Vendor Mgmt'],
    location: 'Klang',
    source: 'JobStreet',
    rating: 3.9,
    status: 'Passive',
  },
  {
    name: 'Rajesh Kumar',
    title: 'Software Engineer',
    skills: ['Go', 'Kubernetes', 'AWS'],
    location: 'Cyberjaya',
    source: 'LinkedIn',
    rating: 4.6,
    status: 'Shortlisted',
  },
  {
    name: 'Mei Ling Tan',
    title: 'Account Manager',
    skills: ['SaaS', 'Renewals'],
    location: 'George Town',
    source: 'Careers page',
    rating: 4.1,
    status: 'Re-engaged',
  },
  {
    name: 'Siti Khadijah',
    title: 'Sales Executive',
    skills: ['Inside Sales', 'CRM'],
    location: 'Subang Jaya',
    source: 'JobStreet',
    rating: 3.7,
    status: 'Passive',
  },
  {
    name: 'Danial Iskandar',
    title: 'Operations Executive',
    skills: ['Supply Chain', 'Power BI'],
    location: 'Seremban',
    source: 'Agency',
    rating: 4.0,
    status: 'Available',
  },
  {
    name: 'Wan Azlan',
    title: 'Software Engineer',
    skills: ['Vue', 'PostgreSQL'],
    location: 'Puchong',
    source: 'Referral',
    rating: 4.3,
    status: 'Re-engaged',
  },
  {
    name: 'Kavitha Subramaniam',
    title: 'Sales Executive',
    skills: ['Field Sales', 'Pipeline'],
    location: 'Johor Bahru',
    source: 'LinkedIn',
    rating: 4.4,
    status: 'Available',
  },
];

/* KPI sparkline trends ------------------------------------------------ */
const SPARK_POOL = [268, 284, 297, 309, 318, 329, 336, 342];
const SPARK_SHORTLISTED = [31, 34, 37, 39, 42, 44, 46, 48];
const SPARK_PASSIVE = [142, 151, 158, 164, 170, 177, 182, 186];
const SPARK_REENGAGED = [9, 11, 13, 15, 17, 19, 21, 23];

/* Talent by skill / role — sums to POOL_SIZE ------------------------- */
const SKILL_MIX: Slice[] = [
  { key: 'engineering', label: 'Engineering', value: 96, color: 'var(--chart-1)' },
  { key: 'sales', label: 'Sales', value: 78, color: 'var(--chart-2)' },
  { key: 'design', label: 'Design', value: 54, color: 'var(--chart-3)' },
  { key: 'operations', label: 'Operations', value: 46, color: 'var(--chart-4)' },
  { key: 'other', label: 'Finance & Other', value: 68, color: 'var(--chart-5)' },
];

/* Candidates by source — sums to POOL_SIZE --------------------------- */
const SOURCE_MIX = [
  { label: 'JobStreet', count: 128 },
  { label: 'LinkedIn', count: 104 },
  { label: 'Referral', count: 58 },
  { label: 'Careers page', count: 34 },
  { label: 'Agency', count: 18 },
];
const SOURCE_SERIES: Series[] = [
  { key: 'count', label: 'Candidates', color: 'var(--chart-2)' },
];

/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<Status, string> = {
  Available: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Shortlisted: 'bg-primary/10 text-primary',
  'Re-engaged': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Passive: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_TONE[status],
      )}
    >
      <LiveDot active={status !== 'Passive'} />
      {status}
    </span>
  );
}

function Rating({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1" title={`Rated ${value} of 5`}>
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'size-3.5',
              i < filled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground/40',
            )}
          />
        ))}
      </span>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">
        {value.toFixed(1)}
      </span>
    </span>
  );
}

export default function TalentPoolScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Talent Pool"
        subtitle="Saved candidates for future roles, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Add to Pool
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Talent pool size"
            value={POOL_SIZE.toLocaleString()}
            delta="+6"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_POOL}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Shortlisted"
            value="48"
            delta="+4"
            deltaTone="up"
            chart={
              <Sparkline data={SPARK_SHORTLISTED} color="var(--chart-1)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Passive"
            value="186"
            delta="+9"
            deltaTone="flat"
            chart={
              <Sparkline data={SPARK_PASSIVE} color="var(--chart-4)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Re-engaged"
            value="23"
            delta="+5"
            deltaTone="up"
            chart={
              <Sparkline data={SPARK_REENGAGED} color="var(--chart-3)" height={36} />
            }
          />
        </BentoCard>

        {/* Skill mix + source breakdown */}
        <BentoCard
          title="Talent by skill / role"
          subtitle="Across the pool"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={SKILL_MIX}
            height={240}
            centerValue={POOL_SIZE.toLocaleString()}
            centerLabel="candidates"
          />
        </BentoCard>
        <BentoCard
          title="Candidates by source"
          subtitle="Where talent comes from"
          icon={BarChart3}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={SOURCE_MIX}
            series={SOURCE_SERIES}
            horizontal
            height={240}
          />
        </BentoCard>

        {/* Candidate table */}
        <BentoCard
          title="Pool candidates"
          subtitle="Most recently added first"
          icon={Users}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="flex flex-wrap items-center gap-2 px-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or skill…" className="h-8 pl-8 text-sm" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="engineering">Software Engineer</SelectItem>
                <SelectItem value="sales">Sales Executive</SelectItem>
                <SelectItem value="account">Account Manager</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="size-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              All sources
              <ChevronDown className="size-4" />
            </Button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Candidate</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CANDIDATES.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{c.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {c.title}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-[220px] flex-wrap gap-1">
                        {c.skills.map((s) => (
                          <Badge key={s} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {c.location}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {c.source}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Rating value={c.rating} />
                    </TableCell>
                    <TableCell>
                      <StatusPill status={c.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Move to pipeline
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-4 py-3 text-sm text-muted-foreground">
            Showing {CANDIDATES.length} of {POOL_SIZE.toLocaleString()} candidates
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
