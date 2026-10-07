import { CalendarClock, CircleCheck, Hourglass, Plus, Timer } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
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

type Status = 'Approved' | 'Pending' | 'Rejected';

const STATUS_STYLES: Record<Status, string> = {
  Approved: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Rejected: 'bg-red-500/15 text-red-600',
};

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

const COLUMNS = ['Date', 'From', 'To', 'Duration', 'Reason', 'Status'];

const REQUESTS: {
  date: string;
  from: string;
  to: string;
  duration: string;
  reason: string;
  status: Status;
}[] = [
  { date: '03 Oct', from: '14:00', to: '16:00', duration: '2h', reason: 'Clinic', status: 'Approved' },
  { date: '28 Sep', from: '09:00', to: '11:00', duration: '2h', reason: 'Bank', status: 'Approved' },
  { date: '10 Oct', from: '15:00', to: '16:30', duration: '1.5h', reason: 'Personal', status: 'Pending' },
  { date: '19 Sep', from: '10:00', to: '11:00', duration: '1h', reason: 'JPJ renewal', status: 'Rejected' },
];

export default function TimeOffScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Time-Off"
        subtitle="Short-duration time-off requests."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Request Time-Off
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="This Month" value="3" note="Requests" icon={CalendarClock} tone="primary" />
        <StatCard label="Approved" value="2" icon={CircleCheck} tone="green" />
        <StatCard label="Pending" value="1" icon={Hourglass} tone="amber" />
        <StatCard label="Hours" value="6.5" note="Total this month" icon={Timer} tone="blue" />
      </div>

      <h2 className="mb-3 text-base font-semibold tracking-tight">My Requests</h2>
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
            <TableBody>
              {REQUESTS.map((r) => (
                <TableRow key={`${r.date}-${r.from}`}>
                  <TableCell className="whitespace-nowrap font-medium">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.from}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.to}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.duration}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{r.reason}</TableCell>
                  <TableCell>
                    <StatusPill status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
