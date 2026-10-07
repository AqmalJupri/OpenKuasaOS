import { Plus, Search, Wallet, CircleCheck, AlertTriangle, FileEdit } from 'lucide-react';
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

type InvoiceStatus = 'Paid' | 'Sent' | 'Overdue' | 'Draft';
type EInvoice = 'Validated' | 'Pending' | null;

type Invoice = {
  no: string;
  date: string;
  customer: string;
  total: string;
  balance: string;
  status: InvoiceStatus;
  eInvoice: EInvoice;
};

const INVOICES: Invoice[] = [
  { no: 'INV-1042', date: '07 Oct', customer: 'Aisyah Trading', total: 'RM 1,240', balance: 'RM 0', status: 'Paid', eInvoice: 'Validated' },
  { no: 'INV-1041', date: '05 Oct', customer: 'Zaki Enterprise', total: 'RM 3,500', balance: 'RM 3,500', status: 'Sent', eInvoice: 'Pending' },
  { no: 'INV-1040', date: '01 Oct', customer: 'Nurul Boutique', total: 'RM 8,900', balance: 'RM 8,900', status: 'Overdue', eInvoice: 'Validated' },
  { no: 'INV-1039', date: '28 Sep', customer: 'Lim Hardware', total: 'RM 2,100', balance: 'RM 0', status: 'Paid', eInvoice: 'Validated' },
  { no: 'INV-1038', date: '25 Sep', customer: 'Siti Decor', total: 'RM 4,200', balance: 'RM 0', status: 'Paid', eInvoice: 'Validated' },
  { no: 'INV-1037', date: '20 Sep', customer: 'Rimba Ventures', total: 'RM 6,400', balance: 'RM 6,400', status: 'Sent', eInvoice: 'Pending' },
  { no: 'INV-DRAFT', date: '—', customer: '—', total: 'RM 0', balance: 'RM 0', status: 'Draft', eInvoice: null },
];

const CUSTOMERS = [
  'Aisyah Trading',
  'Zaki Enterprise',
  'Nurul Boutique',
  'Lim Hardware',
  'Siti Decor',
  'Rimba Ventures',
];

const STATUS_TONE: Record<InvoiceStatus, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-600',
  Sent: 'bg-amber-500/15 text-amber-600',
  Overdue: 'bg-red-500/15 text-red-600',
  Draft: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: InvoiceStatus }) {
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

function EInvoicePill({ value }: { value: EInvoice }) {
  if (!value) return <span className="text-sm text-muted-foreground">—</span>;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        value === 'Validated'
          ? 'bg-emerald-500/15 text-emerald-600'
          : 'bg-amber-500/15 text-amber-600',
      )}
    >
      {value}
    </span>
  );
}

export default function InvoicesScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Invoices"
        subtitle="Sales invoices & e-Invoice status."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Invoice
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding" value="RM 16,900" icon={Wallet} tone="amber" />
        <StatCard label="Paid (MTD)" value="RM 25,900" icon={CircleCheck} tone="green" />
        <StatCard label="Overdue" value="RM 4,200" icon={AlertTriangle} tone="violet" />
        <StatCard label="Drafts" value="3" icon={FileEdit} tone="primary" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Doc no. / customer" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All customers</SelectItem>
            {CUSTOMERS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>e-Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((i) => (
                <TableRow key={i.no}>
                  <TableCell className="whitespace-nowrap font-medium">{i.no}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{i.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.customer}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{i.total}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{i.balance}</TableCell>
                  <TableCell>
                    <StatusPill status={i.status} />
                  </TableCell>
                  <TableCell>
                    <EInvoicePill value={i.eInvoice} />
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
