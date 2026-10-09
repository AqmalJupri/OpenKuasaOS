import { CalendarDays, Clock, Copy, Link2, Plus, Search, TrendingUp } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { AreaTrend, HeatGrid, Sparkline, type Series } from '@/components/charts';
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

const BOOKINGS_TREND = [
  { label: 'Wk1', bookings: 9, completed: 7 },
  { label: 'Wk2', bookings: 12, completed: 10 },
  { label: 'Wk3', bookings: 11, completed: 9 },
  { label: 'Wk4', bookings: 16, completed: 14 },
  { label: 'Wk5', bookings: 18, completed: 15 },
  { label: 'Wk6', bookings: 21, completed: 19 },
  { label: 'Wk7', bookings: 24, completed: 21 },
  { label: 'Wk8', bookings: 31, completed: 27 },
];
const BOOKINGS_SERIES: Series[] = [
  { key: 'bookings', label: 'Bookings', color: 'var(--chart-1)' },
  { key: 'completed', label: 'Completed', color: 'var(--chart-2)' },
];

const HEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HEAT_SLOTS = ['9a', '11a', '1p', '3p', '5p', '7p'];
const HEAT_VALUES = [
  [3, 6, 4, 7, 5, 2],
  [4, 8, 5, 9, 6, 3],
  [5, 9, 6, 10, 7, 4],
  [6, 11, 7, 12, 9, 5],
  [7, 12, 8, 11, 8, 4],
  [2, 5, 6, 7, 5, 3],
  [1, 3, 4, 3, 2, 1],
];

type Upcoming = {
  name: string;
  kind: string;
  when: string;
  via: 'WhatsApp' | 'Zoom' | 'Call';
};
const UPCOMING: Upcoming[] = [
  { name: 'Aisyah Rahim', kind: 'Discovery call', when: 'Today · 2:30pm', via: 'WhatsApp' },
  { name: 'Faiz Hakim', kind: 'Product demo', when: 'Tomorrow · 10:00am', via: 'Zoom' },
  { name: 'Nurul Huda', kind: 'Follow-up', when: 'Thu · 4:00pm', via: 'Call' },
  { name: 'Ahmad Zaki', kind: 'Consultation', when: 'Fri · 11:00am', via: 'WhatsApp' },
];

type BookingLink = {
  title: string;
  slug: string;
  active: boolean;
  views: number;
  bookings: number;
  created: string;
};
const LINKS: BookingLink[] = [
  { title: '30-min Discovery Call', slug: 'rimba.my/book/discovery', active: true, views: 420, bookings: 38, created: '12 Aug 2026' },
  { title: 'Product Demo (45 min)', slug: 'rimba.my/book/demo', active: true, views: 318, bookings: 29, created: '24 Aug 2026' },
  { title: 'Consultation — 1 hour', slug: 'rimba.my/book/consult', active: true, views: 256, bookings: 24, created: '2 Sep 2026' },
  { title: 'Follow-up Call', slug: 'rimba.my/book/follow-up', active: true, views: 190, bookings: 21, created: '9 Sep 2026' },
  { title: 'Onboarding Session', slug: 'rimba.my/book/onboarding', active: false, views: 142, bookings: 18, created: '18 Sep 2026' },
  { title: 'Quick Chat — 15 min', slug: 'rimba.my/book/quick-chat', active: true, views: 96, bookings: 12, created: '1 Oct 2026' },
];

const COLUMNS = [
  'Event Details',
  'Booking Link',
  'Status',
  'Views',
  'Bookings',
  'Created At',
  'Action',
];

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('');
}

/* ------------------------------------------------------------------ */

export default function AppointmentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-4"
        title="Appointments"
        badge={
          <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600">
            BETA
          </span>
        }
        subtitle="Manage scheduled appointments and booking links."
        actions={
          <>
            <Button variant="outline" size="sm">
              View Leads
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              Create Link
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search event title…" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="discovery">Discovery call</SelectItem>
            <SelectItem value="demo">Product demo</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total links"
            value="8"
            delta="+2"
            onPrimary
            chart={
              <Sparkline
                data={[2, 3, 4, 5, 5, 6, 7, 8]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Total bookings"
            value="142"
            delta="+18%"
            deltaTone="up"
            chart={
              <Sparkline data={[72, 88, 95, 110, 118, 128, 135, 142]} height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Upcoming"
            value="17"
            delta="+3"
            deltaTone="up"
            chart={
              <Sparkline
                data={[8, 10, 9, 12, 14, 13, 16, 17]}
                color="var(--chart-2)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Show-rate"
            value="86%"
            delta="+2pt"
            deltaTone="up"
            chart={
              <Sparkline
                data={[79, 80, 82, 81, 84, 85, 85, 86]}
                color="var(--chart-3)"
                height={36}
              />
            }
          />
        </BentoCard>

        {/* Trend + best times */}
        <BentoCard
          title="Bookings over time"
          subtitle="Last 8 weeks"
          icon={TrendingUp}
          className="col-span-2 md:col-span-8"
        >
          <AreaTrend data={BOOKINGS_TREND} series={BOOKINGS_SERIES} height={240} showLegend />
        </BentoCard>
        <BentoCard
          title="Best booking times"
          subtitle="Bookings by day & slot"
          icon={Clock}
          className="col-span-2 md:col-span-4"
        >
          <HeatGrid xLabels={HEAT_SLOTS} yLabels={HEAT_DAYS} values={HEAT_VALUES} />
        </BentoCard>

        {/* Upcoming + links table */}
        <BentoCard
          title="Upcoming appointments"
          subtitle="Next few days"
          icon={CalendarDays}
          className="col-span-2 md:col-span-4"
        >
          <ul className="space-y-2">
            {UPCOMING.map((a) => (
              <li
                key={a.name}
                className="flex items-center gap-3 rounded-lg border bg-background/50 px-3 py-2"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(a.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.kind}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium">{a.when}</p>
                  <p className="text-xs text-muted-foreground">{a.via}</p>
                </div>
              </li>
            ))}
          </ul>
        </BentoCard>
        <BentoCard
          title="Booking links"
          subtitle="Share a link to let people self-schedule"
          icon={Link2}
          className="col-span-2 md:col-span-8"
        >
          <div className="overflow-x-auto">
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
                {LINKS.map((l) => (
                  <TableRow key={l.slug}>
                    <TableCell className="font-medium">{l.title}</TableCell>
                    <TableCell className="text-muted-foreground">{l.slug}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        <LiveDot active={l.active} />
                        {l.active ? 'Active' : 'Paused'}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">{l.views}</TableCell>
                    <TableCell className="tabular-nums">{l.bookings}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {l.created}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Copy className="size-4" />
                        Copy
                      </Button>
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
