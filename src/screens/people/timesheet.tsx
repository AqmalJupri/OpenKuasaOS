import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge,
  Hourglass,
  TrendingUp,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { AreaTrend, HeatGrid, Sparkline, type Series } from '@/components/charts';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const ROWS: { name: string; hours: number[]; billable: number }[] = [
  { name: 'Aisyah Rahim', hours: [8, 8, 7.5, 8, 8], billable: 34 },
  { name: 'Faiz Hakim', hours: [8, 8, 8, 8, 4], billable: 28 },
  { name: 'Ahmad Zaki', hours: [8.5, 8, 8, 8, 8], billable: 30 },
  { name: 'Nurul Huda', hours: [8, 8, 8, 8, 8], billable: 36 },
  { name: 'Lim Wei Jie', hours: [8, 0, 8, 8, 8], billable: 24 },
];

const fmt = (n: number) => n.toFixed(1);
const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

/** This week's figures, kept in sync with the table below. */
const TEAM_TOTAL = ROWS.reduce((acc, r) => acc + sum(r.hours), 0); // 188.0
const TEAM_BILLABLE = ROWS.reduce((acc, r) => acc + r.billable, 0); // 152
const TEAM_SLOTS = ROWS.length * DAYS.length; // 25
const AVG_PER_DAY = TEAM_TOTAL / TEAM_SLOTS; // 7.52
const BILLABLE_PCT = Math.round((TEAM_BILLABLE / TEAM_TOTAL) * 100); // 81

/* KPI sparkline trends (last 8 weeks) ------------------------------- */
const SPARK_TOTAL = [176, 181, 184, 179, 188, 185, 190, 188];
const SPARK_BILLABLE = [138, 142, 147, 141, 150, 148, 154, 152];
const SPARK_OT = [8, 10, 9, 14, 11, 13, 12, 12];
const SPARK_AVG = [7.0, 7.2, 7.4, 7.2, 7.5, 7.4, 7.6, 7.5];

/* Hours over time — last 8 weeks (total vs billable) ---------------- */
const HOURS_TREND = [
  { label: 'Wk1', total: 176, billable: 138 },
  { label: 'Wk2', total: 181, billable: 142 },
  { label: 'Wk3', total: 184, billable: 147 },
  { label: 'Wk4', total: 179, billable: 141 },
  { label: 'Wk5', total: 188, billable: 150 },
  { label: 'Wk6', total: 185, billable: 148 },
  { label: 'Wk7', total: 190, billable: 154 },
  { label: 'Wk8', total: 188, billable: 152 },
];
const HOURS_SERIES: Series[] = [
  { key: 'total', label: 'Total hours', color: 'var(--chart-1)' },
  { key: 'billable', label: 'Billable', color: 'var(--chart-2)' },
];

/* Hours by day — last 6 weeks (rows) × weekday (cols), team totals --- */
const HEAT_WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
const HEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEAT_VALUES = [
  [38, 40, 37, 39, 35, 6, 0],
  [39, 38, 40, 37, 36, 8, 0],
  [37, 39, 38, 40, 34, 4, 0],
  [40, 40, 39, 38, 37, 10, 2],
  [38, 37, 40, 39, 36, 6, 0],
  [39, 40, 38, 40, 35, 8, 0],
];

export default function TimesheetScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Timesheet"
        subtitle="Team hours by day, Saudara."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Week of 05–11 Oct 2026
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Previous week">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next week">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total hours"
            value={fmt(TEAM_TOTAL)}
            delta="+3.2%"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_TOTAL}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Billable"
            value={`${TEAM_BILLABLE}h`}
            delta={`${BILLABLE_PCT}%`}
            deltaTone="up"
            chart={<Sparkline data={SPARK_BILLABLE} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Overtime"
            value="12h"
            delta="-1h"
            deltaTone="up"
            chart={<Sparkline data={SPARK_OT} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg / day"
            value={`${fmt(AVG_PER_DAY)}h`}
            delta="+0.1h"
            deltaTone="up"
            chart={<Sparkline data={SPARK_AVG} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>

        {/* Hours trend + hours-by-day heatmap */}
        <BentoCard
          title="Hours over time"
          subtitle="Total vs billable · last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={HOURS_TREND} series={HOURS_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Hours by day"
          subtitle="Team totals · last 6 weeks"
          icon={CalendarRange}
          className="col-span-2 md:col-span-4"
        >
          <div className="flex h-full items-center">
            <HeatGrid
              xLabels={HEAT_DAYS}
              yLabels={HEAT_WEEKS}
              values={HEAT_VALUES}
              color="var(--chart-1)"
            />
          </div>
        </BentoCard>

        {/* Secondary KPI tiles beside the table context */}
        <BentoCard
          title="Utilisation"
          subtitle="Billable ÷ total this week"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Billable share" value={`${BILLABLE_PCT}%`} delta="+2%" />
          <p className="mt-2 text-xs text-muted-foreground">
            {TEAM_BILLABLE}h billable of {fmt(TEAM_TOTAL)}h logged across {ROWS.length}{' '}
            members.
          </p>
        </BentoCard>
        <BentoCard
          title="Pending approvals"
          subtitle="Awaiting manager sign-off"
          icon={Hourglass}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Timesheets" value="2" delta="due Fri" deltaTone="flat" />
          <p className="mt-2 text-xs text-muted-foreground">
            Faiz Hakim and Lim Wei Jie have unsubmitted days this week.
          </p>
        </BentoCard>
        <BentoCard
          title="On the clock"
          subtitle="Clocked in now"
          icon={Clock}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Members" value="4 / 5" delta="live" deltaTone="up" />
          <p className="mt-2 text-xs text-muted-foreground">
            Faiz Hakim on a half day; the rest clocked in.
          </p>
        </BentoCard>

        {/* Timesheet table */}
        <BentoCard
          title="Weekly timesheet"
          subtitle="This week · hours logged per day"
          icon={CalendarRange}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  {DAYS.map((d) => (
                    <TableHead key={d} className="text-right">
                      {d}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Billable</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="whitespace-nowrap font-medium">
                      <div className="flex items-center gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {r.name.charAt(0)}
                        </span>
                        {r.name}
                      </div>
                    </TableCell>
                    {r.hours.map((h, i) => (
                      <TableCell key={DAYS[i]} className="text-right tabular-nums">
                        {fmt(h)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {r.billable}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {fmt(sum(r.hours))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>{ROWS.length} members</span>
            <span className="tabular-nums">
              {TEAM_BILLABLE}h billable · {fmt(TEAM_TOTAL)}h total
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
