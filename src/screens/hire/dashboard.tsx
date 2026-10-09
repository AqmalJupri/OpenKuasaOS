import {
  Activity,
  ChartColumn,
  Download,
  Filter,
  Gauge,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  BarGroup,
  DonutStat,
  FunnelFlow,
  RadialGauge,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ---- mock data (Rimba Ventures Sdn Bhd · FY2026) ------------------ */

/** Time-to-hire & time-to-offer, monthly (days). Trending down = faster. */
const TIME_TO_HIRE = [
  { label: 'Mar', hire: 36, offer: 22 },
  { label: 'Apr', hire: 35, offer: 21 },
  { label: 'May', hire: 34, offer: 20 },
  { label: 'Jun', hire: 33, offer: 20 },
  { label: 'Jul', hire: 31, offer: 19 },
  { label: 'Aug', hire: 30, offer: 18 },
  { label: 'Sep', hire: 29, offer: 18 },
  { label: 'Oct', hire: 28, offer: 17 },
];
const TIME_SERIES: Series[] = [
  { key: 'hire', label: 'Days to hire', color: 'var(--chart-1)' },
  { key: 'offer', label: 'Days to offer', color: 'var(--chart-2)' },
];

/** Applications by job, this month (short labels) — sums to 142 = Applications · MTD. */
const APPS_BY_JOB = [
  { label: 'Software Eng', applications: 34 },
  { label: 'Sales Exec', applications: 28 },
  { label: 'Designer', applications: 22 },
  { label: 'Account Mgr', applications: 21 },
  { label: 'Support', applications: 20 },
  { label: 'Ops Exec', applications: 17 },
];
const APPS_BY_JOB_SERIES: Series[] = [
  { key: 'applications', label: 'Applications', color: 'var(--chart-2)' },
];

/** Source effectiveness — hires YTD by source (quality, not volume). */
const SOURCE_EFFECTIVENESS: Slice[] = [
  { key: 'referral', label: 'Referral', value: 9, color: 'var(--chart-5)' },
  { key: 'linkedin', label: 'LinkedIn', value: 7, color: 'var(--chart-2)' },
  { key: 'jobstreet', label: 'JobStreet', value: 6, color: 'var(--chart-1)' },
  { key: 'careers', label: 'Careers page', value: 3, color: 'var(--chart-3)' },
];

/** Hiring pipeline snapshot. Applied = 248 = Candidates; Offer = 4 = Offers out. */
const PIPELINE: Slice[] = [
  { key: 'applied', label: 'Applied', value: 248, color: 'var(--chart-1)' },
  { key: 'screening', label: 'Screening', value: 96, color: 'var(--chart-2)' },
  { key: 'interview', label: 'Interview', value: 38, color: 'var(--chart-5)' },
  { key: 'offer', label: 'Offer', value: 4, color: 'var(--chart-3)' },
  { key: 'hired', label: 'Hired', value: 2, color: 'var(--chart-4)' },
];

const ACTIVITY = [
  { text: 'Aisyah Karim moved to Interview — Sales Executive', when: '1h' },
  { text: 'Offer sent to Rajesh Kumar — Software Engineer', when: '3h' },
  { text: 'Nurul Huda completed screening — Account Manager', when: '5h' },
  { text: 'Faiz Rahman applied via LinkedIn — Software Engineer', when: '1d' },
  { text: 'Mei Ling Tan accepted offer — Graphic Designer', when: '2d' },
];

/* ------------------------------------------------------------------ */

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Your recruiting performance · FY2026, Saudara."
        actions={
          <>
            <Select defaultValue="mtd">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtd">This month</SelectItem>
                <SelectItem value="qtd">This quarter</SelectItem>
                <SelectItem value="ytd">Financial year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Time to hire"
            value="28d"
            delta="−3d"
            deltaTone="up"
            onPrimary
            chart={
              <Sparkline
                data={[36, 35, 34, 33, 31, 30, 29, 28]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Applications · MTD"
            value="142"
            delta="+18%"
            deltaTone="up"
            chart={<Sparkline data={[96, 104, 112, 118, 124, 131, 137, 142]} height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Offer-accept rate"
            value="78%"
            delta="+4pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[70, 71, 72, 73, 74, 75, 77, 78]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Cost per hire"
            value="RM 3,200"
            delta="−6%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3800, 3700, 3600, 3500, 3450, 3350, 3280, 3200]}
                color="var(--chart-4)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Time-to-hire trend + source effectiveness */}
        <BentoCard
          title="Time to hire"
          subtitle="Days to hire & offer · FY2026"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={TIME_TO_HIRE} series={TIME_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Source effectiveness"
          subtitle="Hires YTD by source"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={SOURCE_EFFECTIVENESS}
            height={240}
            centerValue="25"
            centerLabel="hires"
          />
        </BentoCard>

        {/* Applications by job + offer-accept gauge */}
        <BentoCard
          title="Applications by job"
          subtitle="This month"
          icon={ChartColumn}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup data={APPS_BY_JOB} series={APPS_BY_JOB_SERIES} horizontal height={240} />
        </BentoCard>
        <BentoCard
          title="Offer-accept rate"
          subtitle="Accepted of offers made"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge
            value={78}
            label="accepted"
            valueLabel="78%"
            color="var(--chart-2)"
            height={240}
          />
        </BentoCard>

        {/* Pipeline funnel + recent activity */}
        <BentoCard
          title="Hiring pipeline"
          subtitle="Applied → hired"
          icon={Filter}
          className="col-span-2 md:col-span-6"
        >
          <FunnelFlow data={PIPELINE} height={220} />
        </BentoCard>
        <BentoCard
          title="Recent activity"
          subtitle="Across your pipeline"
          icon={Activity}
          className="col-span-2 md:col-span-6"
        >
          <ul className="space-y-2.5">
            {ACTIVITY.map((a) => (
              <li key={a.text} className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="min-w-0 flex-1 text-sm leading-snug">{a.text}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {a.when}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
