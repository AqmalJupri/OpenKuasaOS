import { Plus, Search, Undo2, CircleCheck, Clock, Receipt } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
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
import { cn } from '@/lib/utils';

type RefundStatus = 'Refunded' | 'Pending';

type Refund = {
  id: string;
  date: string;
  customer: string;
  invoice: string;
  reason: string;
  amount: string;
  status: RefundStatus;
};

const REFUNDS: Refund[] = [
  { id: 'r1', date: '06 Oct', customer: 'Aisyah Trading', invoice: 'INV-1042', reason: 'Damaged goods', amount: 'RM 240', status: 'Refunded' },
  { id: 'r2', date: '30 Sep', customer: 'Lim Hardware', invoice: 'INV-1039', reason: 'Overpayment', amount: 'RM 450', status: 'Refunded' },
  { id: 'r3', date: '22 Sep', customer: 'Siti Decor', invoice: 'INV-1034', reason: 'Order cancelled', amount: 'RM 1,200', status: 'Refunded' },
  { id: 'r4', date: '08 Oct', customer: 'Nurul Boutique', invoice: 'INV-1036', reason: 'Wrong item delivered', amount: 'RM 680', status: 'Pending' },
];

const STATUS_TONE: Record<RefundStatus, string> = {
  Refunded: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
};

function StatusPill({ status }: { status: RefundStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_TONE[status],
      )}
    >
      {status}
    </span>
  );
}

export default function RefundsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Refunds"
        subtitle="Refunds issued to customers."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Refund
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Refunded (MTD)" value="RM 1,890" icon={Undo2} tone="primary" />
        <StatCard label="Completed" value="3" icon={CircleCheck} tone="green" />
        <StatCard label="Pending" value="1" icon={Clock} tone="amber" />
        <StatCard label="Invoices Affected" value="4" icon={Receipt} tone="blue" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Customer / invoice" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REFUNDS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{r.customer}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.invoice}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.reason}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{r.amount}</TableCell>
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
