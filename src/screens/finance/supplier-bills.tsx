import {
  Plus,
  Search,
  Wallet,
  CircleCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';
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

type BillStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

type Bill = {
  id: string;
  date: string;
  supplier: string;
  due: string;
  total: string;
  balance: string;
  status: BillStatus;
};

const COLUMNS = ['No.', 'Date', 'Supplier', 'Due', 'Total', 'Balance', 'Status'];

const BILLS: Bill[] = [
  {
    id: 'BILL-0231',
    date: '05 Oct 2026',
    supplier: 'Lim Hardware Sdn Bhd',
    due: '04 Nov 2026',
    total: 'RM 3,200.00',
    balance: 'RM 3,200.00',
    status: 'Pending',
  },
  {
    id: 'BILL-0230',
    date: '30 Sep 2026',
    supplier: 'Printhub Enterprise',
    due: '30 Oct 2026',
    total: 'RM 1,450.00',
    balance: 'RM 0.00',
    status: 'Paid',
  },
  {
    id: 'BILL-0229',
    date: '22 Sep 2026',
    supplier: 'Tenaga Nasional Berhad',
    due: '06 Oct 2026',
    total: 'RM 1,800.00',
    balance: 'RM 1,800.00',
    status: 'Overdue',
  },
  {
    id: 'BILL-0228',
    date: '18 Sep 2026',
    supplier: 'Syarikat Maju Jaya',
    due: '18 Oct 2026',
    total: 'RM 4,300.00',
    balance: 'RM 4,300.00',
    status: 'Pending',
  },
  {
    id: 'BILL-0227',
    date: '10 Sep 2026',
    supplier: 'Unifi Business (TM)',
    due: '10 Oct 2026',
    total: 'RM 299.00',
    balance: 'RM 0.00',
    status: 'Paid',
  },
  {
    id: 'BILL-0226',
    date: '07 Oct 2026',
    supplier: 'Kedai Kertas Ah Seng',
    due: '06 Nov 2026',
    total: 'RM 780.00',
    balance: 'RM 780.00',
    status: 'Draft',
  },
];

const STATUS_STYLES: Record<BillStatus, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Overdue: 'bg-red-500/15 text-red-600',
  Draft: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: BillStatus }) {
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

export default function SupplierBillsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Supplier Bills"
        subtitle="Bills from your suppliers."
        actions={
          <Button>
            <Plus className="size-4" />
            New Bill
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Owed" value="RM 9,300" icon={Wallet} tone="amber" />
        <StatCard
          label="Paid (MTD)"
          value="RM 12,100"
          icon={CircleCheck}
          tone="green"
        />
        <StatCard
          label="Overdue"
          value="RM 1,800"
          icon={AlertTriangle}
          tone="violet"
        />
        <StatCard label="Drafts" value="2" icon={FileText} tone="primary" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bills or suppliers…" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
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
              {BILLS.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {b.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{b.supplier}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {b.due}
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {b.total}
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {b.balance}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={b.status} />
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
