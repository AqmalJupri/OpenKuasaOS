import { CircleCheck, CircleX, Hourglass, Plus, Receipt } from 'lucide-react';
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

const COLUMNS = ['Category', 'Amount', 'Date', 'Receipt', 'Status'];

const CLAIMS: {
  category: string;
  amount: string;
  date: string;
  status: Status;
}[] = [
  { category: 'Travel', amount: 'RM 180', date: '02 Oct', status: 'Approved' },
  { category: 'Meals', amount: 'RM 80', date: '03 Oct', status: 'Approved' },
  { category: 'Equipment', amount: 'RM 260', date: '05 Oct', status: 'Pending' },
  { category: 'Parking', amount: 'RM 20', date: '01 Oct', status: 'Approved' },
];

export default function ClaimsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Financial Claims"
        subtitle="Submit and track expense claims."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Claim
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Claimed (MTD)" value="RM 1,240" icon={Receipt} tone="primary" />
        <StatCard label="Approved" value="RM 980" icon={CircleCheck} tone="green" />
        <StatCard label="Pending" value="RM 260" icon={Hourglass} tone="amber" />
        <StatCard label="Rejected" value="RM 0" icon={CircleX} tone="violet" />
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
              {CLAIMS.map((r) => (
                <TableRow key={`${r.category}-${r.date}`}>
                  <TableCell className="whitespace-nowrap font-medium">{r.category}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.amount}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">Attached</TableCell>
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
