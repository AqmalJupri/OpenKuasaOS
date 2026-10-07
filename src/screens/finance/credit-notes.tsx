import { Plus, Search, FileMinus, CircleCheck, FileEdit, Receipt } from 'lucide-react';
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

type CreditStatus = 'Issued' | 'Draft';

type CreditNote = {
  no: string;
  date: string;
  customer: string;
  invoice: string;
  amount: string;
  status: CreditStatus;
};

const CREDIT_NOTES: CreditNote[] = [
  { no: 'CN-34', date: '06 Oct', customer: 'Aisyah Trading', invoice: 'INV-1042', amount: 'RM 240', status: 'Issued' },
  { no: 'CN-33', date: '30 Sep', customer: 'Lim Hardware', invoice: 'INV-1039', amount: 'RM 450', status: 'Issued' },
  { no: 'CN-32', date: '24 Sep', customer: 'Siti Decor', invoice: 'INV-1038', amount: 'RM 600', status: 'Issued' },
  { no: 'CN-31', date: '18 Sep', customer: 'Nurul Boutique', invoice: 'INV-1031', amount: 'RM 1,150', status: 'Issued' },
  { no: 'CN-30', date: '—', customer: 'Zaki Enterprise', invoice: 'INV-1041', amount: 'RM 300', status: 'Draft' },
];

const STATUS_TONE: Record<CreditStatus, string> = {
  Issued: 'bg-emerald-500/15 text-emerald-600',
  Draft: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: CreditStatus }) {
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

export default function CreditNotesScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Credit Notes"
        subtitle="Credits issued to customers."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Credit Note
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Credited (MTD)" value="RM 1,290" icon={FileMinus} tone="primary" />
        <StatCard label="Issued" value="4" icon={CircleCheck} tone="green" />
        <StatCard label="Drafts" value="1" icon={FileEdit} tone="violet" />
        <StatCard label="Invoices Affected" value="5" icon={Receipt} tone="blue" />
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
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
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
                <TableHead>Against Invoice</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CREDIT_NOTES.map((c) => (
                <TableRow key={c.no}>
                  <TableCell className="whitespace-nowrap font-medium">{c.no}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{c.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{c.customer}</TableCell>
                  <TableCell className="whitespace-nowrap">{c.invoice}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{c.amount}</TableCell>
                  <TableCell>
                    <StatusPill status={c.status} />
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
