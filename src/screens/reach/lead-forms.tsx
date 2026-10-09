import {
  BarChart3,
  FileText,
  Filter,
  PieChart,
  Plus,
  Search,
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
  Sparkline,
  type Series,
  type Slice,
} from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type FormStatus = 'Active' | 'Draft';

type LeadForm = {
  id: string;
  name: string;
  category: string;
  slug: string;
  status: FormStatus;
  views: number;
  contacts: number;
  created: string;
};

/** Rows reconcile with the KPIs: contacts sum to 428, views to 2,378. */
const FORMS: LeadForm[] = [
  {
    id: '1',
    name: 'Raya Promo Signup',
    category: 'Promotions',
    slug: '/raya-promo',
    status: 'Active',
    views: 612,
    contacts: 128,
    created: '12 Mar 2026',
  },
  {
    id: '2',
    name: 'Free Consultation',
    category: 'Sales',
    slug: '/free-consult',
    status: 'Active',
    views: 540,
    contacts: 96,
    created: '28 Feb 2026',
  },
  {
    id: '3',
    name: 'Newsletter',
    category: 'Marketing',
    slug: '/newsletter',
    status: 'Active',
    views: 488,
    contacts: 84,
    created: '05 Jan 2026',
  },
  {
    id: '4',
    name: 'Product Demo Request',
    category: 'Sales',
    slug: '/demo-request',
    status: 'Active',
    views: 354,
    contacts: 62,
    created: '19 Jan 2026',
  },
  {
    id: '5',
    name: 'eBook Download',
    category: 'Content',
    slug: '/ebook-sme-growth',
    status: 'Draft',
    views: 246,
    contacts: 38,
    created: '02 Mar 2026',
  },
  {
    id: '6',
    name: 'Event RSVP',
    category: 'Events',
    slug: '/usahawan-meetup',
    status: 'Draft',
    views: 138,
    contacts: 20,
    created: '08 Mar 2026',
  },
];

const CATEGORIES = ['Promotions', 'Sales', 'Marketing', 'Content', 'Events'];

/* KPI sparkline trends ------------------------------------------------ */
const SPARK_FORMS = [2, 3, 3, 4, 4, 5, 5, 6];
const SPARK_LEADS = [268, 296, 318, 347, 371, 392, 410, 428];
const SPARK_CONV = [14.1, 14.8, 15.2, 16.0, 16.6, 17.2, 17.6, 18.0];
const SPARK_TODAY = [6, 8, 9, 11, 8, 10, 13, 12];

/* Submissions over time (last 14 days) — ends at 12 = new today ------- */
const SUBMISSIONS_TREND = [
  { label: '26', submissions: 6 },
  { label: '27', submissions: 8 },
  { label: '28', submissions: 7 },
  { label: '29', submissions: 9 },
  { label: '30', submissions: 11 },
  { label: '1', submissions: 8 },
  { label: '2', submissions: 10 },
  { label: '3', submissions: 13 },
  { label: '4', submissions: 9 },
  { label: '5', submissions: 11 },
  { label: '6', submissions: 14 },
  { label: '7', submissions: 10 },
  { label: '8', submissions: 13 },
  { label: '9', submissions: 12 },
];
const SUBMISSIONS_SERIES: Series[] = [
  { key: 'submissions', label: 'Submissions', color: 'var(--chart-1)' },
];

/* Conversion funnel --------------------------------------------------- */
const FUNNEL: Slice[] = [
  { key: 'views', label: 'Views', value: 2378, color: 'var(--chart-1)' },
  { key: 'starts', label: 'Form starts', value: 1150, color: 'var(--chart-2)' },
  { key: 'submits', label: 'Submits', value: 428, color: 'var(--chart-5)' },
];

/* Top forms by contacts ----------------------------------------------- */
const TOP_FORMS = [
  { label: 'Raya Promo', contacts: 128 },
  { label: 'Free Consult', contacts: 96 },
  { label: 'Newsletter', contacts: 84 },
  { label: 'Product Demo', contacts: 62 },
  { label: 'eBook', contacts: 38 },
  { label: 'Event RSVP', contacts: 20 },
];
const TOP_FORMS_SERIES: Series[] = [
  { key: 'contacts', label: 'Contacts', color: 'var(--chart-1)' },
];

/* Submissions by source ----------------------------------------------- */
const SOURCE_MIX: Slice[] = [
  { key: 'whatsapp', label: 'WhatsApp', value: 182, color: 'var(--chart-1)' },
  { key: 'facebook', label: 'Facebook', value: 118, color: 'var(--chart-2)' },
  { key: 'instagram', label: 'Instagram', value: 84, color: 'var(--chart-5)' },
  { key: 'tiktok', label: 'TikTok', value: 44, color: 'var(--chart-3)' },
];

const COLUMNS = [
  'Form Details',
  'URL / Slug',
  'Status',
  'Views',
  'Contacts',
  'Created At',
  'Action',
];

/* ------------------------------------------------------------------ */

export default function LeadFormsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Lead Forms"
        subtitle="Manage all your lead-generation forms."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Create New Form
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total forms"
            value="6"
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_FORMS}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total leads"
            value="428"
            delta="+8%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_LEADS} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Conversion"
            value="18%"
            delta="+1.4pt"
            deltaTone="up"
            chart={<Sparkline data={SPARK_CONV} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="New today"
            value="12"
            delta="+3"
            deltaTone="up"
            chart={<Sparkline data={SPARK_TODAY} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>

        {/* Submissions trend + conversion funnel */}
        <BentoCard
          title="Submissions over time"
          subtitle="Last 14 days"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend
            data={SUBMISSIONS_TREND}
            series={SUBMISSIONS_SERIES}
            height={240}
          />
        </BentoCard>
        <BentoCard
          title="Conversion funnel"
          subtitle="Views → starts → submits"
          icon={Filter}
          className="col-span-2 md:col-span-4"
        >
          <FunnelFlow data={FUNNEL} height={240} />
        </BentoCard>

        {/* Forms table */}
        <BentoCard
          title="Your forms"
          subtitle="6 forms"
          icon={FileText}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search form title…" className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  {COLUMNS.map((c) => (
                    <TableHead key={c} className="whitespace-nowrap">
                      {c}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {FORMS.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{f.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {f.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                      {f.slug}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2 text-sm">
                        <LiveDot active={f.status === 'Active'} />
                        {f.status}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {f.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {f.contacts.toLocaleString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {f.created}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>Showing {FORMS.length} of {FORMS.length} forms</span>
          </div>
        </BentoCard>

        {/* Top forms + source mix */}
        <BentoCard
          title="Top forms by contacts"
          subtitle="This quarter"
          icon={BarChart3}
          className="col-span-2 md:col-span-8"
        >
          <BarGroup
            data={TOP_FORMS}
            series={TOP_FORMS_SERIES}
            horizontal
            height={220}
          />
        </BentoCard>
        <BentoCard
          title="Submissions by source"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={SOURCE_MIX}
            height={220}
            centerValue="428"
            centerLabel="leads"
          />
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
