import {
  ChartColumn,
  Clock,
  Hourglass,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { BarGroup, Sparkline, type Series } from '@/components/charts';
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

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type OtRecord = {
  name: string;
  date: string;
  hours: number;
  rate: string;
  amount: string;
  status: 'Approved' | 'Pending';
};

const RECORDS: OtRecord[] = [
  { name: 'Ahmad Zaki', date: '05 Oct', hours: 4, rate: '2.0x', amount: 'RM 200', status: 'Approved' },
  { name: 'Lim Wei Jie', date: '04 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Approved' },
  { name: 'Faiz Hakim', date: '03 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
  { name: 'Aisyah Rahim', date: '02 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Approved' },
  { name: 'Nurul Huda', date: '01 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
  { name: 'Siti Aminah', date: '05 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Pending' },
];

/* OT hours by department (this month) — weekday 1.5x vs rest-day 2.0x */
const OT_BY_DEPT = [
  { label: 'Ops', weekday: 18, restday: 10 },
  { label: 'Sales', weekday: 12, restday: 6 },
  { label: 'Marketing', weekday: 10, restday: 4 },
  { label: 'Finance', weekday: 9, restday: 3 },
  { label: 'HR', weekday: 9, restday: 3 },
];
const OT_DEPT_SERIES: Series[] = [
  { key: 'weekday', label: 'Weekday (1.5x)', color: 'var(--chart-1)' },
  { key: 'restday', label: 'Rest day (2.0x)', color: 'var(--chart-4)' },
];

/* OT hours by month — last 6 months -------------------------------- */
const OT_BY_MONTH = [
  { label: 'May', hours: 62 },
  { label: 'Jun', hours: 71 },
  { label: 'Jul', hours: 68 },
  { label: 'Aug', hours: 79 },
  { label: 'Sep', hours: 74 },
  { label: 'Oct', hours: 84 },
];
const OT_MONTH_SERIES: Series[] = [
  { key: 'hours', label: 'OT hours', color: 'var(--chart-2)' },
];

/* KPI sparkline trends (last 8 weeks) ------------------------------- */
const SPARK_HOURS = [16, 18, 15, 21, 19, 22, 20, 21];
const SPARK_COST = [620, 710, 680, 790, 740, 820, 800, 840];
const SPARK_EMP = [4, 5, 4, 6, 5, 6, 6, 6];
const SPARK_PENDING = [3, 2, 4, 1, 2, 2, 1, 2];

export default function OvertimeScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Overtime" subtitle="Overtime hours and cost, Saudara." />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="OT hours (MTD)"
            value="84"
            delta="+13%"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_HOURS}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="OT cost"
            value="RM 3,360"
            delta="+RM 240"
            deltaTone="down"
            chart={<Sparkline data={SPARK_COST} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Employees w/ OT"
            value="6"
            delta="+1"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_EMP} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending approval"
            value="2h"
            delta="1 claim"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_PENDING} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>

        {/* OT by department + OT by month */}
        <BentoCard
          title="OT hours by department"
          subtitle="This month · weekday vs rest day"
          icon={ChartColumn}
          className="col-span-2 md:col-span-7"
        >
          <BarGroup
            data={OT_BY_DEPT}
            series={OT_DEPT_SERIES}
            stacked
            height={240}
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="OT trend"
          subtitle="Total hours · last 6 months"
          icon={TrendingUp}
          className="col-span-2 md:col-span-5"
        >
          <BarGroup data={OT_BY_MONTH} series={OT_MONTH_SERIES} height={240} />
        </BentoCard>

        {/* Quick context tiles */}
        <BentoCard
          title="Rate policy"
          subtitle="Akta Kerja 1955"
          icon={Clock}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Normal day" value="1.5x" />
          <p className="mt-2 text-xs text-muted-foreground">
            Rest day 2.0x · public holiday 3.0x of the hourly rate of pay.
          </p>
        </BentoCard>
        <BentoCard
          title="Avg OT per employee"
          subtitle="This month"
          icon={Users}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Hours" value="14h" delta="within cap" deltaTone="up" />
          <p className="mt-2 text-xs text-muted-foreground">
            Below the 104-hour monthly statutory limit per employee.
          </p>
        </BentoCard>
        <BentoCard
          title="Awaiting sign-off"
          subtitle="Pending claims"
          icon={Hourglass}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Claims" value="1" delta="RM 80" deltaTone="flat" />
          <p className="mt-2 text-xs text-muted-foreground">
            Siti Aminah — 2h weekday OT (1.5x) on 05 Oct.
          </p>
        </BentoCard>

        {/* OT records table */}
        <BentoCard
          title="Overtime records"
          subtitle="Recent claims across the team"
          icon={Wallet}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECORDS.map((r) => (
                  <TableRow key={`${r.name}-${r.date}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {r.name.charAt(0)}
                        </span>
                        <span className="whitespace-nowrap font-medium">{r.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.hours}</TableCell>
                    <TableCell className="tabular-nums">{r.rate}</TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                      {r.amount}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={r.status === 'Pending'} />
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            r.status === 'Approved'
                              ? 'bg-emerald-500/15 text-emerald-600'
                              : 'bg-amber-500/15 text-amber-600',
                          )}
                        >
                          {r.status}
                        </span>
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
