import {
  Activity,
  Banknote,
  ChartColumn,
  Download,
  Gauge,
  PieChart,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  BarGroup,
  DonutStat,
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

/* ---- mock data (Rimba Ventures Sdn Bhd · HR · FY2026) ------------- */

/** Monthly attendance — last present point (94) = Attendance-rate KPI. */
const ATTENDANCE_TREND = [
  { label: 'Mar', present: 90, ontime: 86 },
  { label: 'Apr', present: 91, ontime: 87 },
  { label: 'May', present: 89, ontime: 85 },
  { label: 'Jun', present: 92, ontime: 88 },
  { label: 'Jul', present: 93, ontime: 90 },
  { label: 'Aug', present: 92, ontime: 89 },
  { label: 'Sep', present: 93, ontime: 91 },
  { label: 'Oct', present: 94, ontime: 92 },
];
const ATTENDANCE_SERIES: Series[] = [
  { key: 'present', label: 'Present %', color: 'var(--chart-1)' },
  { key: 'ontime', label: 'On-time %', color: 'var(--chart-2)' },
];

/** Leave utilisation by type — sums to 16 days (ties to Overview leave bars). */
const LEAVE_UTIL: Slice[] = [
  { key: 'annual', label: 'Annual', value: 8, color: 'var(--chart-1)' },
  { key: 'medical', label: 'Medical', value: 5, color: 'var(--chart-2)' },
  { key: 'emergency', label: 'Emergency', value: 2, color: 'var(--chart-5)' },
  { key: 'unpaid', label: 'Unpaid', value: 1, color: 'var(--chart-3)' },
];

/** Headcount by department — sums to 20 = Headcount KPI. */
const HEADCOUNT_BY_DEPT = [
  { label: 'Sales', headcount: 6 },
  { label: 'Operations', headcount: 5 },
  { label: 'Marketing', headcount: 3 },
  { label: 'Finance', headcount: 3 },
  { label: 'Management', headcount: 3 },
];
const DEPT_SERIES: Series[] = [
  { key: 'headcount', label: 'Headcount', color: 'var(--chart-1)' },
];

/** New joiners vs leavers — net +4 ties to headcount growth (16 → 20). */
const JOINERS_LEAVERS = [
  { label: 'May', joiners: 1, leavers: 0 },
  { label: 'Jun', joiners: 2, leavers: 0 },
  { label: 'Jul', joiners: 0, leavers: 1 },
  { label: 'Aug', joiners: 1, leavers: 0 },
  { label: 'Sep', joiners: 1, leavers: 1 },
  { label: 'Oct', joiners: 1, leavers: 0 },
];
const FLOW_SERIES: Series[] = [
  { key: 'joiners', label: 'Joiners', color: 'var(--chart-2)' },
  { key: 'leavers', label: 'Leavers', color: 'var(--chart-4)' },
];

/** Monthly payroll cost (RM k) — last point (182) = Payroll KPI. */
const PAYROLL_TREND = [
  { label: 'Mar', payroll: 158 },
  { label: 'Apr', payroll: 160 },
  { label: 'May', payroll: 164 },
  { label: 'Jun', payroll: 168 },
  { label: 'Jul', payroll: 170 },
  { label: 'Aug', payroll: 174 },
  { label: 'Sep', payroll: 178 },
  { label: 'Oct', payroll: 182 },
];
const PAYROLL_SERIES: Series[] = [
  { key: 'payroll', label: 'Payroll (RM k)', color: 'var(--chart-3)' },
];

const ACTIVITY = [
  { text: 'Payroll run completed — RM 182,000 (incl. EPF, SOCSO, PCB)', when: '2h' },
  { text: 'Siti Lestari — annual leave approved (07–10 Oct)', when: '5h' },
  { text: 'New joiner: Amirul Danial onboarded to Sales', when: '1d' },
  { text: 'Faiz Hakim submitted a medical certificate', when: '1d' },
  { text: 'Ahmad Zaki filed overtime — 4 hrs pending approval', when: '2d' },
  { text: 'EPF/KWSP & SOCSO September contributions submitted', when: '3d' },
];

/* ------------------------------------------------------------------ */

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="HR Dashboard"
        subtitle="People operations · Rimba Ventures Sdn Bhd · FY2026, Saudara."
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
            label="Headcount"
            value="20"
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={[16, 16, 17, 18, 18, 19, 19, 20]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Attendance rate"
            value="94%"
            delta="+1pt"
            deltaTone="up"
            chart={<Sparkline data={[90, 91, 89, 92, 93, 92, 93, 94]} height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Turnover · YTD"
            value="8%"
            delta="−1pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[11, 10, 10, 9, 9, 8, 8, 8]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Payroll · MTD"
            value="RM 182k"
            delta="+2%"
            deltaTone="flat"
            chart={
              <Sparkline
                data={[158, 160, 164, 168, 170, 174, 178, 182]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Attendance trend + leave utilisation */}
        <BentoCard
          title="Attendance trend"
          subtitle="Present & on-time · FY2026"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={ATTENDANCE_TREND} series={ATTENDANCE_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Leave utilisation"
          subtitle="Days this month"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat data={LEAVE_UTIL} height={240} centerValue="16" centerLabel="days" />
        </BentoCard>

        {/* Headcount by department + retention */}
        <BentoCard
          title="Headcount by department"
          subtitle="Active employees"
          icon={ChartColumn}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup data={HEADCOUNT_BY_DEPT} series={DEPT_SERIES} height={240} />
        </BentoCard>
        <BentoCard
          title="Retention"
          subtitle="12-month rolling"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge value={92} label="retained" valueLabel="92%" color="var(--chart-2)" height={240} />
        </BentoCard>

        {/* Joiners vs leavers + payroll trend */}
        <BentoCard
          title="New joiners vs leavers"
          subtitle="Last 6 months"
          icon={UsersRound}
          className="col-span-2 md:col-span-6"
        >
          <BarGroup data={JOINERS_LEAVERS} series={FLOW_SERIES} height={220} showLegend />
        </BentoCard>
        <BentoCard
          title="Payroll cost"
          subtitle="Gross monthly (RM k)"
          icon={Banknote}
          className="col-span-2 md:col-span-6"
        >
          <AreaTrend data={PAYROLL_TREND} series={PAYROLL_SERIES} height={220} />
        </BentoCard>

        {/* Recent activity */}
        <BentoCard
          title="Recent activity"
          subtitle="Across the HR module"
          icon={Activity}
          className="col-span-2 md:col-span-12"
        >
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
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
