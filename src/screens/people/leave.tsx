import { CalendarCheck, HeartPulse, Plus, Siren, WalletCards } from 'lucide-react';
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

const COLUMNS = ['Type', 'From', 'To', 'Days', 'Status', 'Applied'];

const REQUESTS: {
  type: string;
  from: string;
  to: string;
  days: number;
  status: Status;
  applied: string;
}[] = [
  { type: 'Annual', from: '13 Oct', to: '14 Oct', days: 2, status: 'Approved', applied: '01 Oct' },
  { type: 'Medical', from: '25 Sep', to: '25 Sep', days: 1, status: 'Approved', applied: '25 Sep' },
  { type: 'Annual', from: '20 Oct', to: '22 Oct', days: 3, status: 'Pending', applied: '06 Oct' },
  { type: 'Emergency', from: '12 Sep', to: '12 Sep', days: 1, status: 'Rejected', applied: '12 Sep' },
];

export default function LeaveScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Leave"
        subtitle="Apply for leave and track your balance."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Apply Leave
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Annual" value="12 / 16" note="Days remaining" icon={CalendarCheck} tone="primary" />
        <StatCard label="Medical" value="8 / 14" note="Days remaining" icon={HeartPulse} tone="blue" />
        <StatCard label="Emergency" value="2 / 3" note="Days remaining" icon={Siren} tone="amber" />
        <StatCard label="Unpaid" value="0" note="Days taken" icon={WalletCards} tone="violet" />
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
                <TableRow key={`${r.type}-${r.from}-${r.applied}`}>
                  <TableCell className="whitespace-nowrap font-medium">{r.type}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.from}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.to}</TableCell>
                  <TableCell>{r.days}</TableCell>
                  <TableCell>
                    <StatusPill status={r.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{r.applied}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
