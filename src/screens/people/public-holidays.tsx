import { CalendarDays, PieChart, Plus, Sparkles } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

/* ---- Malaysian public holidays · 2026 ----------------------------- */
/* `upcoming` = falls on/after today (09 Oct 2026). */

type Holiday = {
  id: string;
  date: string;
  name: string;
  type: 'National' | 'State';
  states: string;
  day: string;
  upcoming: boolean;
};

const HOLIDAYS: Holiday[] = [
  { id: '1', date: '01 Jan', name: "New Year's Day", type: 'National', states: 'Nationwide', day: 'Thu', upcoming: false },
  { id: '2', date: '01 Feb', name: 'Federal Territory Day', type: 'State', states: 'KL, Labuan, Putrajaya', day: 'Sun', upcoming: false },
  { id: '3', date: '03 Feb', name: 'Thaipusam', type: 'State', states: 'KL, Selangor, Penang, Perak, Johor, N. Sembilan', day: 'Tue', upcoming: false },
  { id: '4', date: '17 Feb', name: 'Chinese New Year', type: 'National', states: 'Nationwide', day: 'Tue', upcoming: false },
  { id: '5', date: '18 Feb', name: 'Chinese New Year (Day 2)', type: 'National', states: 'Nationwide', day: 'Wed', upcoming: false },
  { id: '6', date: '05 Mar', name: 'Nuzul Al-Quran', type: 'State', states: 'Selangor, KL, Pahang, Penang, Perak, Kelantan, Terengganu, Perlis', day: 'Thu', upcoming: false },
  { id: '7', date: '20 Mar', name: 'Hari Raya Aidilfitri', type: 'National', states: 'Nationwide', day: 'Fri', upcoming: false },
  { id: '8', date: '21 Mar', name: 'Hari Raya Aidilfitri (Day 2)', type: 'National', states: 'Nationwide', day: 'Sat', upcoming: false },
  { id: '9', date: '01 May', name: 'Labour Day', type: 'National', states: 'Nationwide', day: 'Fri', upcoming: false },
  { id: '10', date: '27 May', name: 'Hari Raya Aidiladha', type: 'National', states: 'Nationwide', day: 'Wed', upcoming: false },
  { id: '11', date: '31 May', name: 'Wesak Day', type: 'National', states: 'Nationwide', day: 'Sun', upcoming: false },
  { id: '12', date: '01 Jun', name: "Agong's Birthday", type: 'National', states: 'Nationwide', day: 'Mon', upcoming: false },
  { id: '13', date: '16 Jun', name: 'Awal Muharram', type: 'National', states: 'Nationwide', day: 'Tue', upcoming: false },
  { id: '14', date: '25 Aug', name: 'Maulidur Rasul', type: 'National', states: 'Nationwide', day: 'Tue', upcoming: false },
  { id: '15', date: '31 Aug', name: 'Hari Merdeka', type: 'National', states: 'Nationwide', day: 'Mon', upcoming: false },
  { id: '16', date: '16 Sep', name: 'Malaysia Day', type: 'National', states: 'Nationwide', day: 'Wed', upcoming: false },
  { id: '17', date: '10 Oct', name: "Sarawak Governor's Birthday", type: 'State', states: 'Sarawak', day: 'Sat', upcoming: true },
  { id: '18', date: '02 Nov', name: "Sultan of Perak's Birthday", type: 'State', states: 'Perak', day: 'Mon', upcoming: true },
  { id: '19', date: '08 Nov', name: 'Deepavali', type: 'National', states: 'All except Sarawak', day: 'Sun', upcoming: true },
  { id: '20', date: '25 Dec', name: 'Christmas Day', type: 'National', states: 'Nationwide', day: 'Fri', upcoming: true },
];

const TOTAL = HOLIDAYS.length;
const NATIONAL = HOLIDAYS.filter((h) => h.type === 'National').length;
const STATE = HOLIDAYS.filter((h) => h.type === 'State').length;
const UPCOMING = HOLIDAYS.filter((h) => h.upcoming);

const TYPE_MIX: Slice[] = [
  { key: 'national', label: 'National', value: NATIONAL, color: 'var(--chart-1)' },
  { key: 'state', label: 'State', value: STATE, color: 'var(--chart-3)' },
];

export default function PublicHolidaysScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Public Holidays"
        subtitle="Malaysian public holidays · calendar year 2026, Saudara."
        actions={
          <>
            <Select defaultValue="2026">
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="size-4" />
              Add Holiday
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat label="Total holidays" value={TOTAL} delta="2026" deltaTone="flat" onPrimary />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Upcoming" value={UPCOMING.length} delta="rest of 2026" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="This month" value="1" delta="October" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="National" value={NATIONAL} delta={`${STATE} state`} deltaTone="flat" />
        </BentoCard>

        {/* Type mix + upcoming */}
        <BentoCard
          title="By type"
          subtitle="National vs state"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={TYPE_MIX}
            height={220}
            centerValue={String(TOTAL)}
            centerLabel="holidays"
          />
        </BentoCard>
        <BentoCard
          title="Coming up"
          subtitle="Holidays still ahead this year"
          icon={Sparkles}
          className="col-span-2 md:col-span-8"
        >
          <ul className="divide-y">
            {UPCOMING.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-2.5">
                <LiveDot active />
                <span className="w-16 shrink-0 text-sm font-semibold tabular-nums">
                  {h.date}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {h.name}
                </span>
                <Badge variant="secondary" className="shrink-0">
                  {h.type}
                </Badge>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Full calendar table */}
        <BentoCard
          title="2026 holiday calendar"
          subtitle="Pulsing dot marks holidays still ahead"
          icon={CalendarDays}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-10" />
                  <TableHead>Date</TableHead>
                  <TableHead>Holiday</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>States</TableHead>
                  <TableHead>Day</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HOLIDAYS.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <LiveDot active={h.upcoming} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium tabular-nums">
                      {h.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{h.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{h.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {h.states}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {h.day}
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
