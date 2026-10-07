import { CircleCheck, Clock, Coins, Hourglass, Plus } from 'lucide-react';
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

const COLUMNS = ['Date', 'Hours', 'Rate', 'Amount', 'Status'];

const CLAIMS: {
  date: string;
  hours: number;
  rate: string;
  amount: string;
  status: Status;
}[] = [
  { date: '02 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
  { date: '04 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Approved' },
  { date: '05 Oct', hours: 4, rate: '2.0x', amount: 'RM 200', status: 'Pending' },
  { date: '01 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
];

export default function OtClaimsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="OT Claims"
        subtitle="Claim overtime hours."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Claim OT
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="OT Hours (MTD)" value="12" icon={Clock} tone="primary" />
        <StatCard label="Approved" value="9" note="Hours" icon={CircleCheck} tone="green" />
        <StatCard label="Pending" value="3" note="Hours" icon={Hourglass} tone="amber" />
        <StatCard label="Est. Pay" value="RM 480" icon={Coins} tone="blue" />
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
                <TableRow key={r.date}>
                  <TableCell className="whitespace-nowrap font-medium">{r.date}</TableCell>
                  <TableCell>{r.hours}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.rate}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.amount}</TableCell>
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
