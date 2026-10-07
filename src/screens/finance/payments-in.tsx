import { Plus, Search, Banknote, CalendarDays, Layers, CreditCard } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Badge } from '@/components/ui/badge';
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

type PaymentStatus = 'Allocated' | 'Pending';

type Payment = {
  id: string;
  date: string;
  customer: string;
  invoice: string;
  method: 'Bank Transfer' | 'Cash' | 'Card';
  amount: string;
  status: PaymentStatus;
};

const PAYMENTS: Payment[] = [
  { id: 'p1', date: '07 Oct', customer: 'Aisyah Trading', invoice: 'INV-1042', method: 'Bank Transfer', amount: 'RM 1,240', status: 'Allocated' },
  { id: 'p2', date: '05 Oct', customer: 'Lim Hardware', invoice: 'INV-1039', method: 'Bank Transfer', amount: 'RM 2,100', status: 'Allocated' },
  { id: 'p3', date: '04 Oct', customer: 'Siti Decor', invoice: 'INV-1038', method: 'Card', amount: 'RM 4,200', status: 'Allocated' },
  { id: 'p4', date: '02 Oct', customer: 'Nurul Boutique', invoice: 'INV-1033', method: 'Cash', amount: 'RM 850', status: 'Allocated' },
  { id: 'p5', date: '30 Sep', customer: 'Rimba Ventures', invoice: 'INV-1030', method: 'Bank Transfer', amount: 'RM 6,800', status: 'Allocated' },
  { id: 'p6', date: '08 Oct', customer: 'Zaki Enterprise', invoice: 'INV-1041', method: 'Bank Transfer', amount: 'RM 1,000', status: 'Pending' },
];

const STATUS_TONE: Record<PaymentStatus, string> = {
  Allocated: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
};

function StatusPill({ status }: { status: PaymentStatus }) {
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

export default function PaymentsInScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payments In"
        subtitle="Customer payments received."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Record Payment
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Received (MTD)" value="RM 25,900" icon={Banknote} tone="green" />
        <StatCard label="This Week" value="RM 6,400" icon={CalendarDays} tone="blue" />
        <StatCard label="Unallocated" value="RM 0" icon={Layers} tone="amber" />
        <StatCard label="Methods" value="3" icon={CreditCard} tone="primary" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Customer / invoice" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
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
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENTS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{p.date}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{p.customer}</TableCell>
                  <TableCell className="whitespace-nowrap">{p.invoice}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.method}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{p.amount}</TableCell>
                  <TableCell>
                    <StatusPill status={p.status} />
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
