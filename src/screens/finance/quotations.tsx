import { Plus, Search, FileText, CircleCheck, Clock, FileEdit } from 'lucide-react';
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

type QuoteStatus = 'Accepted' | 'Sent' | 'Expired' | 'Draft';

type Quotation = {
  no: string;
  date: string;
  customer: string;
  total: string;
  validUntil: string;
  status: QuoteStatus;
};

const QUOTATIONS: Quotation[] = [
  { no: 'QT-225', date: '06 Oct', customer: 'Aisyah Trading', total: 'RM 12,000', validUntil: '06 Nov', status: 'Accepted' },
  { no: 'QT-224', date: '04 Oct', customer: 'Zaki Enterprise', total: 'RM 9,500', validUntil: '04 Nov', status: 'Sent' },
  { no: 'QT-223', date: '29 Sep', customer: 'Lim Hardware', total: 'RM 7,500', validUntil: '29 Oct', status: 'Sent' },
  { no: 'QT-222', date: '12 Sep', customer: 'Siti Decor', total: 'RM 3,200', validUntil: '27 Sep', status: 'Expired' },
  { no: 'QT-221', date: '02 Sep', customer: 'Rimba Ventures', total: 'RM 5,800', validUntil: '17 Sep', status: 'Expired' },
  { no: 'QT-220', date: '—', customer: 'Nurul Boutique', total: 'RM 2,400', validUntil: '—', status: 'Draft' },
];

const CUSTOMERS = [
  'Aisyah Trading',
  'Zaki Enterprise',
  'Lim Hardware',
  'Siti Decor',
  'Rimba Ventures',
  'Nurul Boutique',
];

const STATUS_TONE: Record<QuoteStatus, string> = {
  Accepted: 'bg-emerald-500/15 text-emerald-600',
  Sent: 'bg-amber-500/15 text-amber-600',
  Expired: 'bg-red-500/15 text-red-600',
  Draft: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: QuoteStatus }) {
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

export default function QuotationsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Quotations"
        subtitle="Quotes & proposals."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Quotation
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open" value="RM 22,000" icon={FileText} tone="primary" />
        <StatCard label="Accepted" value="RM 12,000" icon={CircleCheck} tone="green" />
        <StatCard label="Expired" value="2" icon={Clock} tone="amber" />
        <StatCard label="Draft" value="1" icon={FileEdit} tone="violet" />
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
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
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
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUOTATIONS.map((q) => (
                <TableRow key={q.no}>
                  <TableCell className="whitespace-nowrap font-medium">{q.no}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{q.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{q.customer}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{q.total}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{q.validUntil}</TableCell>
                  <TableCell>
                    <StatusPill status={q.status} />
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
