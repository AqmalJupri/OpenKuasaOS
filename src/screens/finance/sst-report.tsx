import {
  CalendarClock,
  ChartColumn,
  FileText,
  Landmark,
  PieChart,
  Receipt,
  Wallet,
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
import { Button } from '@/components/ui/button';
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

/* ---- mock data (Rimba Ventures Sdn Bhd · SST / LHDN) -------------- */

/** SST collected vs paid per taxable period (RM). */
const BY_PERIOD = [
  { label: 'Mar–Apr', collected: 1914, paid: 870 },
  { label: 'May–Jun', collected: 2130, paid: 910 },
  { label: 'Jul–Aug', collected: 2292, paid: 980 },
  { label: 'Sep–Oct', collected: 2568, paid: 1104 },
];
const PERIOD_SERIES: Series[] = [
  { key: 'collected', label: 'SST collected (RM)', color: 'var(--chart-1)' },
  { key: 'paid', label: 'SST paid (RM)', color: 'var(--chart-2)' },
];

/** Current period supplies by treatment (RM) — sums to 42,800. */
const BY_TREATMENT: Slice[] = [
  { key: 'taxable', label: 'Taxable', value: 33800, color: 'var(--chart-1)' },
  { key: 'exempt', label: 'Exempt', value: 6000, color: 'var(--chart-2)' },
  { key: 'outofscope', label: 'Out of scope', value: 3000, color: 'var(--chart-5)' },
];

type LineItem = {
  id: string;
  description: string;
  code: string;
  rate: string;
  taxable: string;
  sst: string;
};

/** Sep–Oct 2026 taxable-period line items. */
const LINE_ITEMS: LineItem[] = [
  { id: '1', description: 'Consultancy & advisory', code: 'SV-8', rate: '8%', taxable: 'RM 18,000.00', sst: 'RM 1,440.00' },
  { id: '2', description: 'Software licences', code: 'SV-8', rate: '8%', taxable: 'RM 9,000.00', sst: 'RM 720.00' },
  { id: '3', description: 'Logistics & delivery', code: 'SV-6', rate: '6%', taxable: 'RM 6,800.00', sst: 'RM 408.00' },
  { id: '4', description: 'Exported goods', code: 'E', rate: '0%', taxable: 'RM 6,000.00', sst: 'RM 0.00' },
  { id: '5', description: 'Inter-company recharge', code: 'OS', rate: '—', taxable: 'RM 3,000.00', sst: 'RM 0.00' },
];

type ReturnStatus = 'Due' | 'Filed';

type SstPeriod = {
  id: string;
  period: string;
  taxable: string;
  sst: string;
  due: string;
  status: ReturnStatus;
};

const PERIODS: SstPeriod[] = [
  { id: '1', period: 'Sep–Oct 2026', taxable: 'RM 42,800', sst: 'RM 2,568', due: '30 Nov 2026', status: 'Due' },
  { id: '2', period: 'Jul–Aug 2026', taxable: 'RM 38,200', sst: 'RM 2,292', due: '30 Sep 2026', status: 'Filed' },
  { id: '3', period: 'May–Jun 2026', taxable: 'RM 35,500', sst: 'RM 2,130', due: '31 Jul 2026', status: 'Filed' },
  { id: '4', period: 'Mar–Apr 2026', taxable: 'RM 31,900', sst: 'RM 1,914', due: '31 May 2026', status: 'Filed' },
];

const STATUS_STYLES: Record<ReturnStatus, string> = {
  Due: 'bg-amber-500/15 text-amber-600',
  Filed: 'bg-emerald-500/15 text-emerald-600',
};

/* ------------------------------------------------------------------ */

export default function SstReportScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="SST Report"
        subtitle="Sales & Service Tax summary, Saudara."
        actions={
          <>
            <Select defaultValue="sepoct">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sepoct">Sep–Oct 2026</SelectItem>
                <SelectItem value="julaug">Jul–Aug 2026</SelectItem>
                <SelectItem value="mayjun">May–Jun 2026</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <FileText className="size-4" />
              Export SST-02
            </Button>
            <Button size="sm">File return</Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="SST collected"
            value="RM 2,568"
            delta="+12%"
            onPrimary
            chart={
              <Sparkline
                data={[1914, 2130, 2292, 2568]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="SST paid (input)"
            value="RM 1,104"
            delta="+13%"
            deltaTone="flat"
            chart={
              <Sparkline
                data={[870, 910, 980, 1104]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Net payable"
            value="RM 1,464"
            delta="to LHDN"
            deltaTone="down"
            chart={
              <Sparkline
                data={[1044, 1220, 1312, 1464]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Next due"
            value="30 Nov"
            delta="Sep–Oct return"
            deltaTone="flat"
            chart={
              <Sparkline
                data={[1, 2, 3, 4, 5, 6, 7, 8]}
                color="var(--chart-4)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* SST by period + supply treatment */}
        <BentoCard
          title="SST by period"
          subtitle="Collected vs paid · last 4 taxable periods"
          icon={ChartColumn}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={BY_PERIOD}
            series={PERIOD_SERIES}
            height={240}
            showLegend
          />
        </BentoCard>
        <BentoCard
          title="Supplies by treatment"
          subtitle="Sep–Oct 2026"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={BY_TREATMENT}
            height={240}
            centerValue="RM 42.8k"
            centerLabel="supplies"
          />
        </BentoCard>

        {/* Next deadline + return history */}
        <BentoCard
          title="Next submission"
          subtitle="LHDN taxable period Sep–Oct 2026"
          icon={CalendarClock}
          tone="muted"
          className="col-span-2 md:col-span-5"
        >
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <CalendarClock className="size-5 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <p className="text-sm font-semibold">Return due 30 Nov 2026</p>
              <p className="text-xs text-muted-foreground">
                Net RM 1,464 payable. File SST-02 & pay within one month of the
                period end to avoid penalties.
              </p>
            </div>
          </div>
        </BentoCard>
        <BentoCard
          title="Return history"
          subtitle="Filed & upcoming SST-02 returns"
          icon={Landmark}
          className="col-span-2 md:col-span-7"
        >
          <ul className="divide-y">
            {PERIODS.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {p.period}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Due {p.due} · SST {p.sst}
                  </span>
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                    STATUS_STYLES[p.status],
                  )}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Line items table */}
        <BentoCard
          title="SST line items"
          subtitle="Sep–Oct 2026 · taxable period breakdown"
          icon={Receipt}
          action={
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Wallet className="size-3.5" />
              net = collected − input
            </span>
          }
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Description</TableHead>
                  <TableHead>Tax code</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Taxable amount</TableHead>
                  <TableHead className="text-right">SST</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LINE_ITEMS.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {l.description}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
                        {l.code}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {l.rate}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {l.taxable}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                      {l.sst}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 bg-muted/30 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    RM 42,800.00
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    RM 2,568.00
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
