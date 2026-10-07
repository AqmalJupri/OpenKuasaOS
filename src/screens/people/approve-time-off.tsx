import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
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

type Status = 'Pending' | 'Approved' | 'Rejected';

const STATUS_STYLE: Record<Status, string> = {
  Approved: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Rejected: 'bg-red-500/15 text-red-600',
};

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLE[status],
      )}
    >
      {status}
    </span>
  );
}

function EmployeeCell({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {name.charAt(0)}
      </span>
      <span className="whitespace-nowrap font-medium">{name}</span>
    </div>
  );
}

function ApprovalActions({ status }: { status: Status }) {
  if (status !== 'Pending')
    return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex gap-2">
      <Button size="sm">Approve</Button>
      <Button variant="outline" size="sm">
        Reject
      </Button>
    </div>
  );
}

type Row = {
  id: string;
  employee: string;
  date: string;
  duration: string;
  reason: string;
  status: Status;
};

const ROWS: Row[] = [
  { id: '1', employee: 'Nurul Huda', date: '10 Oct', duration: '1.5h', reason: 'Personal', status: 'Pending' },
  { id: '2', employee: 'Siti Aminah', date: '09 Oct', duration: '2h', reason: 'Clinic', status: 'Pending' },
  { id: '3', employee: 'Ahmad Zaki', date: '11 Oct', duration: '1h', reason: 'Bank', status: 'Pending' },
];

export default function ApproveTimeOffScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Time-Off Approvals" subtitle="Pending time-off requests." />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <EmployeeCell name={r.employee} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.duration}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.reason}</TableCell>
                  <TableCell>
                    <StatusPill status={r.status} />
                  </TableCell>
                  <TableCell>
                    <ApprovalActions status={r.status} />
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
