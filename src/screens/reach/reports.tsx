import {
  Download,
  Filter,
  Gauge,
  MapPin,
  Percent,
  PieChart,
  TrendingUp,
  Users,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

const LEADS_TREND = [
  { label: 'Wk1', leads: 34, qualified: 12 },
  { label: 'Wk2', leads: 41, qualified: 16 },
  { label: 'Wk3', leads: 38, qualified: 15 },
  { label: 'Wk4', leads: 52, qualified: 22 },
  { label: 'Wk5', leads: 48, qualified: 24 },
  { label: 'Wk6', leads: 63, qualified: 29 },
  { label: 'Wk7', leads: 59, qualified: 31 },
  { label: 'Wk8', leads: 72, qualified: 38 },
];
const LEADS_SERIES: Series[] = [
  { key: 'leads', label: 'Leads', color: 'var(--chart-1)' },
  { key: 'qualified', label: 'Qualified', color: 'var(--chart-2)' },
];

const LEADS_BY_SOURCE: Slice[] = [
  { key: 'whatsapp', label: 'WhatsApp', value: 142, color: 'var(--chart-1)' },
  { key: 'facebook', label: 'Facebook', value: 96, color: 'var(--chart-2)' },
  { key: 'instagram', label: 'Instagram', value: 68, color: 'var(--chart-5)' },
  { key: 'referral', label: 'Referral', value: 24, color: 'var(--chart-3)' },
  { key: 'website', label: 'Website form', value: 12, color: 'var(--chart-4)' },
];

const FUNNEL: Slice[] = [
  { key: 'leads', label: 'Leads', value: 342, color: 'var(--chart-1)' },
  { key: 'contacted', label: 'Contacted', value: 264, color: 'var(--chart-2)' },
  { key: 'qualified', label: 'Qualified', value: 158, color: 'var(--chart-5)' },
  { key: 'booked', label: 'Booked', value: 96, color: 'var(--chart-3)' },
  { key: 'won', label: 'Won', value: 48, color: 'var(--chart-4)' },
];

const LEADS_BY_STATE = [
  { label: 'Selangor', leads: 118 },
  { label: 'Kuala Lumpur', leads: 86 },
  { label: 'Johor', leads: 54 },
  { label: 'Penang', leads: 48 },
  { label: 'Sabah', leads: 36 },
];
const STATE_SERIES: Series[] = [
  { key: 'leads', label: 'Leads', color: 'var(--chart-2)' },
];

type SourceRow = {
  source: string;
  leads: number;
  qualified: number;
  conv: string;
  value: string;
};

const TOP_SOURCES: SourceRow[] = [
  { source: 'WhatsApp', leads: 142, qualified: 74, conv: '5.6%', value: 'RM 48,200' },
  { source: 'Facebook', leads: 96, qualified: 44, conv: '4.2%', value: 'RM 31,500' },
  { source: 'Instagram', leads: 68, qualified: 28, conv: '3.8%', value: 'RM 22,100' },
  { source: 'Referral', leads: 24, qualified: 8, conv: '6.1%', value: 'RM 18,900' },
  { source: 'Website form', leads: 12, qualified: 4, conv: '7.0%', value: 'RM 9,400' },
];

/* ------------------------------------------------------------------ */

export default function ReportsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Reports"
        subtitle="Lead, conversion and pipeline analytics."
        actions={
          <>
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
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
            label="Total leads"
            value="342"
            delta="+12%"
            onPrimary
            chart={
              <Sparkline
                data={[34, 41, 38, 52, 48, 63, 59, 72]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Conversion rate"
            value="4.8%"
            delta="+0.6pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3.9, 4.0, 4.1, 4.3, 4.4, 4.5, 4.7, 4.8]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg response time"
            value="2.4h"
            delta="−0.3h"
            deltaTone="up"
            chart={
              <Sparkline
                data={[3.4, 3.1, 3.0, 2.8, 2.7, 2.6, 2.5, 2.4]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Qualified"
            value="158"
            delta="+8%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[12, 16, 15, 22, 24, 29, 31, 38]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Trend + source mix */}
        <BentoCard
          title="Leads vs qualified"
          subtitle="Last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={LEADS_TREND} series={LEADS_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Leads by source"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={LEADS_BY_SOURCE}
            height={240}
            centerValue="342"
            centerLabel="leads"
          />
        </BentoCard>

        {/* Funnel + geography + qualification */}
        <BentoCard
          title="Lead → won"
          subtitle="Pipeline conversion"
          icon={Filter}
          className="col-span-2 md:col-span-4"
        >
          <FunnelFlow data={FUNNEL} height={200} />
        </BentoCard>
        <BentoCard
          title="Leads by state"
          subtitle="This period"
          icon={MapPin}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup
            data={LEADS_BY_STATE}
            series={STATE_SERIES}
            horizontal
            height={200}
          />
        </BentoCard>
        <BentoCard
          title="Qualification rate"
          subtitle="Qualified of all leads"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge
            value={46}
            valueLabel="46%"
            label="qualified"
            color="var(--chart-2)"
            height={200}
          />
        </BentoCard>

        {/* Top sources table */}
        <BentoCard
          title="Top sources"
          subtitle="By leads this period"
          icon={Users}
          action={
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Percent className="size-3.5" />
              conversion = won / leads
            </span>
          }
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Qualified</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead className="text-right">Pipeline value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_SOURCES.map((r) => (
                  <TableRow key={r.source}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {r.source}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.leads}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.qualified}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.conv}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {r.value}
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
