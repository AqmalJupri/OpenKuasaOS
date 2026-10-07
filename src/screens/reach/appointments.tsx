import {
  CalendarCheck,
  CalendarDays,
  CalendarX2,
  History,
  Link2,
  Plus,
  Search,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { EmptyState } from '@/components/screen/empty-state';
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const COLUMNS = [
  'Event Details',
  'Booking Link',
  'Status',
  'Views',
  'Bookings',
  'Created At',
  'Action',
];

export default function AppointmentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Links" value={0} icon={Link2} tone="primary" />
        <StatCard
          label="Total Bookings"
          value={0}
          note="All active bookings"
          icon={CalendarCheck}
          tone="blue"
        />
        <StatCard
          label="Bookings Yesterday"
          value={0}
          icon={History}
          tone="amber"
        />
        <StatCard
          label="Today Bookings"
          value={0}
          icon={CalendarDays}
          tone="green"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
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
          </Table>
        </div>
        <EmptyState
          icon={CalendarX2}
          title="No appointment links found."
          description="Create a booking link to let leads schedule with you."
        />
      </div>
    </ScreenContainer>
  );
}
