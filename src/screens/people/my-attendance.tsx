import {
  AlarmClock,
  CalendarCheck,
  Clock,
  LogIn,
  Timer,
  TrendingUp,
  Umbrella,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  DonutStat,
  HeatGrid,
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

/* ---- mock data (Rimba Ventures Sdn Bhd · Saudara) ----------------- */

type AttendanceStatus = 'Present' | 'Late' | 'Absent';

type AttendanceRow = {
  date: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: AttendanceStatus;
  today?: boolean;
};

const HISTORY: AttendanceRow[] = [
  { date: '07 Oct 2026', clockIn: '08:59', clockOut: '—', hours: '—', status: 'Present', today: true },
  { date: '06 Oct 2026', clockIn: '09:02', clockOut: '18:10', hours: '8.1', status: 'Present' },
  { date: '05 Oct 2026', clockIn: '08:55', clockOut: '18:00', hours: '8.1', status: 'Present' },
  { date: '03 Oct 2026', clockIn: '09:20', clockOut: '18:00', hours: '7.6', status: 'Late' },
  { date: '02 Oct 2026', clockIn: '09:00', clockOut: '18:05', hours: '8.1', status: 'Present' },
  { date: '01 Oct 2026', clockIn: '—', clockOut: '—', hours: '0.0', status: 'Absent' },
  { date: '30 Sep 2026', clockIn: '08:58', clockOut: '18:02', hours: '8.1', status: 'Present' },
];

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-500/15 text-emerald-600',
  Late: 'bg-amber-500/15 text-amber-600',
  Absent: 'bg-red-500/15 text-red-600',
};

/* KPI sparkline trends (last 7 periods) ------------------------------ */
const SPARK_PRESENT = [16, 17, 18, 18, 19, 18, 18];
const SPARK_CLOCKIN = [6, 3, 4, 12, 2, 3, 2];
const SPARK_LATE = [2, 1, 2, 1, 0, 1, 1];
const SPARK_LEAVE = [14, 13, 12, 11, 10, 9, 8.5];

/* Hours worked per day — last 10 working days ------------------------ */
const HOURS_TREND = [
  { label: '24 Sep', hours: 8.0 },
  { label: '25 Sep', hours: 8.2 },
  { label: '26 Sep', hours: 7.9 },
  { label: '29 Sep', hours: 8.3 },
  { label: '30 Sep', hours: 8.1 },
  { label: '01 Oct', hours: 0 },
  { label: '02 Oct', hours: 8.1 },
  { label: '03 Oct', hours: 7.6 },
  { label: '05 Oct', hours: 8.1 },
  { label: '06 Oct', hours: 8.1 },
];
const HOURS_SERIES: Series[] = [
  { key: 'hours', label: 'Hours worked', color: 'var(--chart-1)' },
];

/* Leave taken this year by type (days) ------------------------------- */
const LEAVE_MIX: Slice[] = [
  { key: 'annual', label: 'Annual', value: 6.5, color: 'var(--chart-1)' },
  { key: 'medical', label: 'Medical (MC)', value: 2, color: 'var(--chart-2)' },
  { key: 'emergency', label: 'Emergency', value: 1, color: 'var(--chart-4)' },
  { key: 'replacement', label: 'Replacement', value: 1, color: 'var(--chart-5)' },
];
const LEAVE_TAKEN = LEAVE_MIX.reduce((sum, s) => sum + s.value, 0);

/* Attendance pattern — daily hours across the last 8 weeks ----------- */
const HEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HEAT_WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
const HEAT_VALUES: number[][] = [
  [8, 8, 8, 8, 8],
  [8, 8, 8, 7, 8],
  [8, 8, 8, 8, 8],
  [8, 7, 8, 8, 8],
  [8, 8, 8, 8, 0],
  [8, 8, 8, 8, 8],
  [0, 8, 8, 8, 8],
  [8, 8, 8, 7, 8],
];

export default function MyAttendanceScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="My Attendance"
        subtitle="Your clock-ins, hours and leave balance, Saudara."
        actions={
          <Button size="sm">
            <LogIn className="size-4" />
            Clock In
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Days present"
            value="18"
            delta="of 19"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_PRESENT}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg clock-in"
            value="09:02"
            delta="+2 min"
            deltaTone="down"
            chart={<Sparkline data={SPARK_CLOCKIN} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Late count"
            value="1"
            delta="this month"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_LATE} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Leave balance"
            value="8.5"
            delta="days left"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_LEAVE} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>

        {/* Hours trend + attendance heatmap */}
        <BentoCard
          title="Hours worked"
          subtitle="Last 10 working days"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={HOURS_TREND} series={HOURS_SERIES} height={240} />
        </BentoCard>
        <BentoCard
          title="Attendance pattern"
          subtitle="Hours per day · 8 weeks"
          icon={CalendarCheck}
          className="col-span-2 md:col-span-4"
          bodyClassName="flex items-center"
        >
          <HeatGrid
            xLabels={HEAT_DAYS}
            yLabels={HEAT_WEEKS}
            values={HEAT_VALUES}
            color="var(--chart-1)"
          />
        </BentoCard>

        {/* Leave mix + recent clock-ins */}
        <BentoCard
          title="Leave taken"
          subtitle="By type · this year"
          icon={Umbrella}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={LEAVE_MIX}
            height={240}
            centerValue={LEAVE_TAKEN.toString()}
            centerLabel="days taken"
          />
        </BentoCard>

        {/* Recent clock-in / clock-out */}
        <BentoCard
          title="Recent clock-ins"
          subtitle="Clock-in and clock-out history"
          icon={Clock}
          flush
          className="col-span-2 md:col-span-8"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HISTORY.map((r) => (
                  <TableRow key={r.date}>
                    <TableCell className="whitespace-nowrap font-medium">
                      <span className="flex items-center gap-2">
                        {r.today ? <LiveDot active /> : null}
                        {r.date}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      <span className="flex items-center gap-1.5">
                        {r.status === 'Late' ? (
                          <AlarmClock className="size-3.5 text-amber-600" />
                        ) : null}
                        {r.clockIn}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">{r.clockOut}</TableCell>
                    <TableCell className="tabular-nums">{r.hours}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
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
            <span>October 2026 · 142.5h of 176h</span>
            <span className="flex items-center gap-1.5">
              <Timer className="size-4" />
              81% of target
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
