import {
  BarChart3,
  Filter,
  Gauge,
  Megaphone,
  PieChart,
  Plus,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LiveDot } from '@/components/ui/live-dot';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

const SPEND_LEADS = [
  { label: 'Wk1', spend: 540, leads: 92 },
  { label: 'Wk2', spend: 620, leads: 101 },
  { label: 'Wk3', spend: 680, leads: 98 },
  { label: 'Wk4', spend: 760, leads: 128 },
  { label: 'Wk5', spend: 840, leads: 141 },
  { label: 'Wk6', spend: 840, leads: 150 },
];
const SPEND_LEADS_SERIES: Series[] = [
  { key: 'spend', label: 'Spend (RM)', color: 'var(--chart-2)' },
  { key: 'leads', label: 'Leads', color: 'var(--chart-1)' },
];

const SPEND_BY_CHANNEL: Slice[] = [
  { key: 'whatsapp', label: 'WhatsApp', value: 1480, color: 'var(--chart-1)' },
  { key: 'facebook', label: 'Facebook', value: 1260, color: 'var(--chart-2)' },
  { key: 'instagram', label: 'Instagram', value: 900, color: 'var(--chart-5)' },
  { key: 'tiktok', label: 'TikTok', value: 640, color: 'var(--chart-3)' },
];

const LEADS_BY_CHANNEL = [
  { label: 'WhatsApp', leads: 280 },
  { label: 'Facebook', leads: 190 },
  { label: 'Instagram', leads: 140 },
  { label: 'TikTok', leads: 90 },
];
const LEADS_BY_CHANNEL_SERIES: Series[] = [
  { key: 'leads', label: 'Leads', color: 'var(--chart-1)' },
];

const AD_FUNNEL: Slice[] = [
  { key: 'impressions', label: 'Impressions', value: 420000, color: 'var(--chart-5)' },
  { key: 'reach', label: 'Reach', value: 128000, color: 'var(--chart-2)' },
  { key: 'clicks', label: 'Clicks', value: 9600, color: 'var(--chart-1)' },
  { key: 'leads', label: 'Leads', value: 700, color: 'var(--chart-3)' },
  { key: 'customers', label: 'Customers', value: 180, color: 'var(--chart-4)' },
];

type CampaignStatus = 'Active' | 'Paused';

type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  spend: string;
  reach: string;
  leads: number;
  cpl: string;
};

const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Ramadan–Raya Promo',
    status: 'Active',
    spend: 'RM 1,200',
    reach: '48K',
    leads: 96,
    cpl: 'RM 12.50',
  },
  {
    id: '2',
    name: 'New Product Launch',
    status: 'Active',
    spend: 'RM 1,850',
    reach: '61K',
    leads: 70,
    cpl: 'RM 26.40',
  },
  {
    id: '3',
    name: 'Retargeting — Cart',
    status: 'Paused',
    spend: 'RM 640',
    reach: '12K',
    leads: 54,
    cpl: 'RM 11.85',
  },
  {
    id: '4',
    name: 'Brand Awareness',
    status: 'Paused',
    spend: 'RM 590',
    reach: '22K',
    leads: 18,
    cpl: 'RM 32.80',
  },
];

/* ------------------------------------------------------------------ */

export default function AdStudioScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Ad Studio"
        subtitle="Create and manage AI-powered ad campaigns."
        actions={
          <>
            <Button variant="outline" size="sm">
              Connect Meta
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              New Campaign
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* Connect Meta promo banner */}
        <BentoCard className="col-span-2 border-primary/30 bg-primary/5 md:col-span-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                  <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8v2.8h2.7V21h2.8Z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Connect your Meta account</p>
                <p className="text-sm text-muted-foreground">
                  Link Meta to launch ads and sync leads straight into your pipeline.
                </p>
              </div>
            </div>
            <Button size="sm" className="shrink-0 self-start sm:self-auto">
              Login with Facebook
            </Button>
          </div>
        </BentoCard>

        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Active campaigns"
            value="3"
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={[2, 2, 3, 2, 3, 3]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Ad spend"
            value="RM 4,280"
            delta="This month"
            deltaTone="flat"
            chart={<Sparkline data={[540, 620, 680, 760, 840, 840]} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Reach"
            value="128K"
            delta="+9%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[88, 96, 104, 112, 121, 128]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Cost / lead"
            value="RM 6.10"
            delta="−8%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[7.4, 7.1, 7.3, 6.8, 6.4, 6.1]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Spend & leads trend + spend mix */}
        <BentoCard
          title="Spend & leads"
          subtitle="Last 6 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={SPEND_LEADS} series={SPEND_LEADS_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Spend by channel"
          subtitle="This month (RM)"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={SPEND_BY_CHANNEL}
            height={240}
            centerValue="4,280"
            centerLabel="RM spend"
          />
        </BentoCard>

        {/* Leads by channel + ad funnel + budget */}
        <BentoCard
          title="Leads by channel"
          subtitle="This month"
          icon={BarChart3}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup
            data={LEADS_BY_CHANNEL}
            series={LEADS_BY_CHANNEL_SERIES}
            horizontal
            height={200}
          />
        </BentoCard>
        <BentoCard
          title="Ad funnel"
          subtitle="Impression → customer"
          icon={Filter}
          className="col-span-2 md:col-span-4"
        >
          <FunnelFlow data={AD_FUNNEL} height={200} />
        </BentoCard>
        <BentoCard
          title="Budget used"
          subtitle="RM 4,280 of RM 6,000"
          icon={Gauge}
          className="col-span-2 md:col-span-4"
        >
          <RadialGauge
            value={71}
            valueLabel="71%"
            label="of budget"
            color="var(--chart-2)"
            height={200}
          />
        </BentoCard>

        {/* Campaigns table */}
        <BentoCard
          title="Campaigns"
          subtitle="Live & paused this month"
          icon={Megaphone}
          action={
            <Button variant="outline" size="sm">
              <Users className="size-4" />
              Audiences
            </Button>
          }
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Reach</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">CPL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CAMPAIGNS.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {c.name}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={c.status === 'Active'} />
                        <span className="text-sm">{c.status}</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {c.spend}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{c.reach}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.leads}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {c.cpl}
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
