import {
  ChartColumn,
  Image as ImageIcon,
  Layers,
  PieChart,
  Sparkles,
  TrendingUp,
  Trophy,
  Type as TypeIcon,
  Upload,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import {
  AreaTrend,
  BarGroup,
  DonutStat,
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type CreativeType = 'Image' | 'Video' | 'Copy';
type CreativeStatus = 'Live' | 'Paused' | 'Draft';

type Creative = {
  id: string;
  name: string;
  type: CreativeType;
  channel: string;
  ctr: number;
  status: CreativeStatus;
};

const CREATIVES: Creative[] = [
  { id: '1', name: 'Raya Sale — Square', type: 'Image', channel: 'Facebook', ctr: 2.4, status: 'Live' },
  { id: '2', name: 'Product Hero 9:16', type: 'Video', channel: 'Instagram', ctr: 3.1, status: 'Live' },
  { id: '3', name: 'Testimonial Reel', type: 'Video', channel: 'TikTok', ctr: 4.2, status: 'Live' },
  { id: '4', name: 'Carousel — 3 slides', type: 'Image', channel: 'Facebook', ctr: 1.9, status: 'Paused' },
  { id: '5', name: 'Flash Sale Banner', type: 'Image', channel: 'WhatsApp', ctr: 2.8, status: 'Live' },
  { id: '6', name: 'Founder Story', type: 'Video', channel: 'Instagram', ctr: 3.6, status: 'Live' },
  { id: '7', name: 'WhatsApp Broadcast', type: 'Copy', channel: 'WhatsApp', ctr: 2.0, status: 'Live' },
  { id: '8', name: 'Promo Code Card', type: 'Copy', channel: 'WhatsApp', ctr: 1.7, status: 'Draft' },
];

/** Whole-bank mix (48 creatives), not just the 8 shown in the library. */
const TYPE_MIX: Slice[] = [
  { key: 'image', label: 'Image', value: 24, color: 'var(--chart-1)' },
  { key: 'video', label: 'Video', value: 15, color: 'var(--chart-5)' },
  { key: 'copy', label: 'Copy', value: 9, color: 'var(--chart-3)' },
];

const PRODUCED = [
  { label: 'Mar', produced: 5, ai: 2 },
  { label: 'Apr', produced: 6, ai: 3 },
  { label: 'May', produced: 4, ai: 2 },
  { label: 'Jun', produced: 7, ai: 4 },
  { label: 'Jul', produced: 6, ai: 3 },
  { label: 'Aug', produced: 8, ai: 5 },
  { label: 'Sep', produced: 10, ai: 7 },
  { label: 'Oct', produced: 14, ai: 12 },
];
const PRODUCED_SERIES: Series[] = [
  { key: 'produced', label: 'Produced', color: 'var(--chart-1)' },
  { key: 'ai', label: 'AI-generated', color: 'var(--chart-5)' },
];

const CTR_BY_FORMAT = [
  { label: 'Image', ctr: 2.3 },
  { label: 'Video', ctr: 3.6 },
  { label: 'Copy', ctr: 1.8 },
];
const CTR_SERIES: Series[] = [
  { key: 'ctr', label: 'Avg CTR %', color: 'var(--chart-2)' },
];

const TYPE_ICON: Record<CreativeType, LucideIcon> = {
  Image: ImageIcon,
  Video: Video,
  Copy: TypeIcon,
};

const TOP_CREATIVES = [...CREATIVES].sort((a, b) => b.ctr - a.ctr).slice(0, 5);

/* ------------------------------------------------------------------ */

function CreativeGrid({ filter }: { filter?: CreativeType }) {
  const items = filter ? CREATIVES.filter((c) => c.type === filter) : CREATIVES;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((c) => {
        const Icon = TYPE_ICON[c.type];
        return (
          <div
            key={c.id}
            className="group/creative overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-primary/10 text-muted-foreground">
              <Icon className="size-8 transition-transform duration-300 group-hover/creative:scale-110 motion-reduce:transform-none" />
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground ring-1 ring-inset ring-border backdrop-blur">
                <span
                  className={`size-1.5 rounded-full ${
                    c.status === 'Live' ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                  }`}
                />
                {c.status}
              </span>
            </div>
            <div className="p-3">
              <p className="truncate font-medium">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.channel}</p>
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary">{c.type}</Badge>
                <span className="text-xs tabular-nums text-muted-foreground">
                  CTR {c.ctr.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CreativeBankScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-4"
        title="Creative Bank"
        subtitle="Your library of ad creatives and copy, Saudara."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" />
              Upload
            </Button>
            <Button size="sm">
              <Sparkles className="size-4 animate-twinkle" />
              Generate with AI
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total creatives"
            value="48"
            delta="+8"
            onPrimary
            chart={
              <Sparkline
                data={[28, 31, 34, 37, 40, 43, 45, 48]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Avg CTR"
            value="2.6%"
            delta="+0.3pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[2.1, 2.2, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Best format"
            value="Video"
            delta="31% of mix"
            deltaTone="flat"
            chart={
              <Sparkline
                data={[3.0, 3.1, 3.3, 3.4, 3.5, 3.8, 4.0, 4.2]}
                color="var(--chart-5)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Generated this month"
            value="12"
            delta="+45%"
            deltaTone="up"
            chart={
              <Sparkline
                data={[2, 3, 2, 4, 3, 5, 7, 12]}
                color="var(--chart-1)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Production trend + type mix */}
        <BentoCard
          title="Creatives produced"
          subtitle="Last 8 months"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={PRODUCED} series={PRODUCED_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Creatives by type"
          subtitle="Whole bank"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={TYPE_MIX}
            height={240}
            centerValue="48"
            centerLabel="creatives"
          />
        </BentoCard>

        {/* CTR by format + top performers */}
        <BentoCard
          title="Avg CTR by format"
          subtitle="This month"
          icon={ChartColumn}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup data={CTR_BY_FORMAT} series={CTR_SERIES} horizontal height={200} />
        </BentoCard>
        <BentoCard
          title="Top performing creatives"
          subtitle="By click-through rate"
          icon={Trophy}
          className="col-span-2 md:col-span-8"
        >
          <ul className="divide-y">
            {TOP_CREATIVES.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-2.5">
                <LiveDot active={c.status === 'Live'} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {c.name}
                </span>
                <Badge variant="secondary" className="shrink-0">
                  {c.type}
                </Badge>
                <span className="hidden w-24 shrink-0 text-right text-sm text-muted-foreground sm:block">
                  {c.channel}
                </span>
                <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums">
                  {c.ctr.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Library */}
        <BentoCard
          title="Creative library"
          subtitle="Showing 8 of 48 · 4 channels"
          icon={Layers}
          className="col-span-2 md:col-span-12"
        >
          <Tabs defaultValue="all" className="gap-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="copy">Copy</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <CreativeGrid />
            </TabsContent>
            <TabsContent value="images">
              <CreativeGrid filter="Image" />
            </TabsContent>
            <TabsContent value="videos">
              <CreativeGrid filter="Video" />
            </TabsContent>
            <TabsContent value="copy">
              <CreativeGrid filter="Copy" />
            </TabsContent>
          </Tabs>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
