import {
  Award,
  ChartColumn,
  CircleCheck,
  ClipboardList,
  PieChart,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Rating = 'Exceeds' | 'Meets' | 'Below';

type Review = {
  name: string;
  cycle: string;
  manager: string;
  self: string;
  final: string;
  rating: Rating;
  status: 'Completed' | 'In review';
};

const REVIEWS: Review[] = [
  { name: 'Aisyah Rahim', cycle: 'H2 2026', manager: '4.4', self: '4.2', final: '4.3', rating: 'Exceeds', status: 'Completed' },
  { name: 'Ahmad Zaki', cycle: 'H2 2026', manager: '4.0', self: '4.1', final: '4.0', rating: 'Meets', status: 'Completed' },
  { name: 'Faiz Hakim', cycle: 'H2 2026', manager: '3.6', self: '3.8', final: '3.7', rating: 'Meets', status: 'Completed' },
  { name: 'Nurul Huda', cycle: 'H2 2026', manager: '4.6', self: '4.3', final: '4.5', rating: 'Exceeds', status: 'Completed' },
  { name: 'Siti Aminah', cycle: 'H2 2026', manager: '3.1', self: '3.4', final: '3.2', rating: 'Below', status: 'In review' },
  { name: 'Lim Wei Jie', cycle: 'H2 2026', manager: '3.9', self: '3.7', final: '3.8', rating: 'Meets', status: 'Completed' },
];

const RATING_STYLES: Record<Rating, string> = {
  Exceeds: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Meets: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Below: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

/** Rating distribution across completed reviews (sums to 23). */
const RATING_MIX: Slice[] = [
  { key: 'exceeds', label: 'Exceeds', value: 8, color: 'var(--chart-2)' },
  { key: 'meets', label: 'Meets', value: 11, color: 'var(--chart-1)' },
  { key: 'below', label: 'Below', value: 4, color: 'var(--chart-4)' },
];

/* Average final rating by department (out of 5), short axis labels. */
const BY_DEPT = [
  { label: 'Sales', rating: 4.3 },
  { label: 'Finance', rating: 4.0 },
  { label: 'Ops', rating: 3.7 },
  { label: 'Support', rating: 4.5 },
  { label: 'Mktg', rating: 3.2 },
  { label: 'Eng', rating: 3.8 },
];
const DEPT_SERIES: Series[] = [
  { key: 'rating', label: 'Avg rating', color: 'var(--chart-1)' },
];

export default function ReviewScoresScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Review Scores"
        subtitle="Performance review results · H2 2026, Saudara."
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Reviews"
            value="26"
            delta="+4"
            onPrimary
            chart={
              <Sparkline
                data={[10, 14, 18, 21, 23, 25, 26, 26]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Completed"
            value="23"
            delta="88%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[8, 11, 15, 18, 20, 22, 23, 23]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg rating"
            value="4.0"
            delta="+0.2"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3.6, 3.7, 3.7, 3.8, 3.9, 3.9, 4.0, 4.0]}
                color="var(--chart-1)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Exceeds"
            value="8"
            delta="+2"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3, 4, 5, 6, 7, 7, 8, 8]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Rating distribution + by department */}
        <BentoCard
          title="Rating distribution"
          subtitle="Completed reviews"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={RATING_MIX}
            height={240}
            centerValue="23"
            centerLabel="rated"
          />
        </BentoCard>
        <BentoCard
          title="Average rating by department"
          subtitle="Final score out of 5"
          icon={ChartColumn}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup data={BY_DEPT} series={DEPT_SERIES} horizontal height={240} />
        </BentoCard>

        {/* Review table */}
        <BentoCard
          title="Review scores"
          subtitle="Manager · self · final rating"
          icon={Users}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead className="text-right">Manager</TableHead>
                  <TableHead className="text-right">Self</TableHead>
                  <TableHead className="text-right">Final</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REVIEWS.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="whitespace-nowrap font-medium">{r.name}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {r.cycle}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.manager}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.self}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {r.final}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          RATING_STYLES[r.rating],
                        )}
                      >
                        {r.rating}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2 whitespace-nowrap text-muted-foreground">
                        <LiveDot active={r.status === 'In review'} />
                        {r.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Award className="size-4 text-emerald-600" /> 8 exceeds
            </span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="size-4" /> 23 completed
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Star className="size-4 text-amber-600" /> avg 4.0 / 5
            </span>
            <span className="flex items-center gap-1.5">
              <ClipboardList className="size-4" /> 3 in review
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
