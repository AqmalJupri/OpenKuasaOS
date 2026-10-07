import { Plus, Wallet, CalendarDays, Clock, Building2 } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Badge } from '@/components/ui/badge';
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

type PaymentStatus = 'Paid' | 'Scheduled' | 'Pending';

type Payment = {
  id: string;
  date: string;
  supplier: string;
  bill: string;
  method: 'Bank Transfer' | 'Cash' | 'Cheque';
  amount: string;
  status: PaymentStatus;
};

const COLUMNS = ['Date', 'Supplier', 'Bill', 'Method', 'Amount', 'Status'];

const PAYMENTS: Payment[] = [
  {
    id: 'PAY-0118',
    date: '06 Oct 2026',
    supplier: 'Printhub Enterprise',
    bill: 'BILL-0230',
    method: 'Bank Transfer',
    amount: 'RM 1,450.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0117',
    date: '04 Oct 2026',
    supplier: 'Unifi Business (TM)',
    bill: 'BILL-0227',
    method: 'Bank Transfer',
    amount: 'RM 299.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0116',
    date: '02 Oct 2026',
    supplier: 'Kedai Kertas Ah Seng',
    bill: 'BILL-0224',
    method: 'Cash',
    amount: 'RM 1,650.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0115',
    date: '28 Sep 2026',
    supplier: 'Lim Hardware Sdn Bhd',
    bill: 'BILL-0221',
    method: 'Cheque',
    amount: 'RM 4,200.00',
    status: 'Paid',
  },
  {
    id: 'PAY-0114',
    date: '10 Oct 2026',
    supplier: 'Tenaga Nasional Berhad',
    bill: 'BILL-0229',
    method: 'Bank Transfer',
    amount: 'RM 1,800.00',
    status: 'Scheduled',
  },
  {
    id: 'PAY-0113',
    date: '12 Oct 2026',
    supplier: 'Syarikat Maju Jaya',
    bill: 'BILL-0228',
    method: 'Bank Transfer',
    amount: 'RM 4,300.00',
    status: 'Pending',
  },
];

const STATUS_STYLES: Record<PaymentStatus, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Scheduled: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function PaymentsOutScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payments Out"
        subtitle="Payments made to suppliers."
        actions={
          <Button>
            <Plus className="size-4" />
            Record Payment
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Paid (MTD)"
          value="RM 12,100"
          icon={Wallet}
          tone="primary"
        />
        <StatCard
          label="This Week"
          value="RM 3,400"
          icon={CalendarDays}
          tone="blue"
        />
        <StatCard
          label="Scheduled"
          value="RM 1,800"
          icon={Clock}
          tone="amber"
        />
        <StatCard label="Suppliers" value="6" icon={Building2} tone="green" />
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
            <TableBody>
              {PAYMENTS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {p.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">
                    {p.supplier}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{p.bill}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.method}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {p.amount}
                  </TableCell>
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
