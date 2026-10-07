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
  hours: number;
  amount: string;
  status: Status;
};

const ROWS: Row[] = [
  { id: '1', employee: 'Ahmad Zaki', date: '05 Oct', hours: 4, amount: 'RM 200', status: 'Pending' },
  { id: '2', employee: 'Lim Wei Jie', date: '04 Oct', hours: 2, amount: 'RM 80', status: 'Pending' },
  { id: '3', employee: 'Faiz Hakim', date: '03 Oct', hours: 3, amount: 'RM 120', status: 'Pending' },
  { id: '4', employee: 'Aisyah Rahim', date: '01 Oct', hours: 2, amount: 'RM 80', status: 'Approved' },
];

export default function ApproveOvertimeScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Overtime Approvals" subtitle="Pending overtime claims." />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Amount</TableHead>
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
                  <TableCell className="whitespace-nowrap">{r.hours}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.amount}</TableCell>
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
