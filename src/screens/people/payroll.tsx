import { PieChart, ReceiptText, TrendingUp, Users } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  DonutStat,
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

/* ---- mock data (Rimba Ventures Sdn Bhd · October 2026) ------------ */

type PayrollRow = {
  name: string;
  gross: number;
  epf: number;
  socso: number;
  eis: number;
  pcb: number;
  status: 'Paid' | 'Pending';
};

/** Payroll run detail — a sample of the 24-headcount October run. */
const ROWS: PayrollRow[] = [
  { name: 'Aisyah Rahim', gross: 4000, epf: 440, socso: 60, eis: 8, pcb: 120, status: 'Paid' },
  { name: 'Faiz Hakim', gross: 3500, epf: 385, socso: 50, eis: 7, pcb: 90, status: 'Paid' },
  { name: 'Ahmad Zaki', gross: 6000, epf: 660, socso: 80, eis: 10, pcb: 280, status: 'Paid' },
  { name: 'Nurul Huda', gross: 4500, epf: 495, socso: 65, eis: 9, pcb: 160, status: 'Paid' },
  { name: 'Siti Aminah', gross: 2800, epf: 308, socso: 45, eis: 6, pcb: 40, status: 'Pending' },
  { name: 'Lim Wei Jie', gross: 3200, epf: 352, socso: 50, eis: 6, pcb: 60, status: 'Paid' },
];

const rm = (n: number) => `RM ${n.toLocaleString('en-MY')}`;
const deductions = (r: PayrollRow) => r.epf + r.socso + r.eis + r.pcb;
const net = (r: PayrollRow) => r.gross - deductions(r);

/* Payroll cost over time (RM k) — gross vs net take-home. */
const COST_TREND = [
  { label: 'Mar', gross: 86.0, net: 73.5 },
  { label: 'Apr', gross: 88.0, net: 75.0 },
  { label: 'May', gross: 89.0, net: 76.0 },
  { label: 'Jun', gross: 91.0, net: 77.5 },
  { label: 'Jul', gross: 92.0, net: 78.4 },
  { label: 'Aug', gross: 93.5, net: 79.6 },
  { label: 'Sep', gross: 95.0, net: 80.9 },
  { label: 'Oct', gross: 96.4, net: 82.1 },
];
const COST_SERIES: Series[] = [
  { key: 'gross', label: 'Gross (RM k)', color: 'var(--chart-1)' },
  { key: 'net', label: 'Net (RM k)', color: 'var(--chart-2)' },
];

/** Statutory & tax deductions this run (RM) — sums to RM 14,340. */
const DEDUCTION_MIX: Slice[] = [
  { key: 'epf', label: 'EPF / KWSP', value: 10604, color: 'var(--chart-1)' },
  { key: 'pcb', label: 'PCB / MTD', value: 2320, color: 'var(--chart-2)' },
  { key: 'socso', label: 'SOCSO', value: 1180, color: 'var(--chart-3)' },
  { key: 'eis', label: 'EIS', value: 236, color: 'var(--chart-4)' },
];

function StatusPill({ status }: { status: PayrollRow['status'] }) {
  return (
    <span className="flex items-center gap-2">
      <LiveDot active={status === 'Paid'} />
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          status === 'Paid'
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
        )}
      >
        {status}
      </span>
    </span>
  );
}

export default function PayrollScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payroll"
        subtitle="Run and review monthly payroll · October 2026, Saudara."
        actions={<Button size="sm">Run Payroll</Button>}
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Gross payroll"
            value="RM 96,400"
            delta="+4%"
            onPrimary
            chart={
              <Sparkline
                data={[86, 88, 89, 91, 92, 93.5, 95, 96.4]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Net pay"
            value="RM 82,060"
            delta="+3%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[73.5, 75, 76, 77.5, 78.4, 79.6, 80.9, 82.1]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="EPF / KWSP"
            value="RM 10,604"
            delta="+2%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[9.5, 9.7, 9.8, 10.0, 10.1, 10.3, 10.4, 10.6]}
                color="var(--chart-1)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Headcount paid"
            value="22 / 24"
            delta="+2"
            deltaTone="up"
            chart={
              <Sparkline
                data={[20, 21, 21, 22, 22, 23, 23, 22]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Cost trend + deductions breakdown */}
        <BentoCard
          title="Payroll cost over time"
          subtitle="Gross vs net · last 8 months"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={COST_TREND} series={COST_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Deductions breakdown"
          subtitle="This run"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={DEDUCTION_MIX}
            height={240}
            centerValue="RM 14.3k"
            centerLabel="deductions"
          />
        </BentoCard>

        {/* Payroll run table */}
        <BentoCard
          title="Payroll run"
          subtitle="October 2026 · statutory deductions applied"
          icon={ReceiptText}
          action={
            <Button variant="outline" size="sm">
              Export EA
            </Button>
          }
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">EPF</TableHead>
                  <TableHead className="text-right">SOCSO</TableHead>
                  <TableHead className="text-right">EIS</TableHead>
                  <TableHead className="text-right">PCB</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="whitespace-nowrap font-medium">{r.name}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {rm(r.gross)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums text-muted-foreground">
                      {rm(r.epf)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums text-muted-foreground">
                      {rm(r.socso)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums text-muted-foreground">
                      {rm(r.eis)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums text-muted-foreground">
                      {rm(r.pcb)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {rm(deductions(r))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold tabular-nums">
                      {rm(net(r))}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-2 border-t px-4 py-3 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>Showing {ROWS.length} of 24 employees in this run</span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
