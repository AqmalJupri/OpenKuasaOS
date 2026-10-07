import { Upload, Inbox, CircleCheck, TriangleAlert, CalendarDays, Receipt } from 'lucide-react';
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

type InboxReceipt = {
  id: string;
  file: string;
  vendor: string;
  date: string;
  amount: string;
  status: 'Matched' | 'Review';
};

const RECEIPTS: InboxReceipt[] = [
  { id: '1', file: 'receipt-0042.jpg', vendor: 'Shell', date: '03 Oct 2026', amount: 'RM 142.50', status: 'Matched' },
  { id: '2', file: 'receipt-0041.jpg', vendor: 'TNB', date: '02 Oct 2026', amount: 'RM 318.20', status: 'Matched' },
  { id: '3', file: 'receipt-0040.png', vendor: 'Grab', date: '02 Oct 2026', amount: 'RM 36.00', status: 'Matched' },
  { id: '4', file: 'receipt-0039.jpg', vendor: 'Lazada', date: '01 Oct 2026', amount: 'RM 249.90', status: 'Review' },
  { id: '5', file: 'receipt-0038.pdf', vendor: 'Printhub', date: '30 Sep 2026', amount: 'RM 310.00', status: 'Matched' },
  { id: '6', file: 'receipt-0037.jpg', vendor: 'Kedai Runcit', date: '29 Sep 2026', amount: 'RM 123.40', status: 'Review' },
];

export default function ReceiptsInboxScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Receipts Inbox"
        subtitle="Snap, upload & auto-extract receipts."
        actions={
          <Button size="sm">
            <Upload className="size-4" />
            Upload Receipt
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="In Inbox" value="6" icon={Inbox} tone="primary" />
        <StatCard label="Matched" value="4" icon={CircleCheck} tone="green" />
        <StatCard label="Needs Review" value="2" icon={TriangleAlert} tone="amber" />
        <StatCard label="This Month" value="RM 1,180" icon={CalendarDays} tone="blue" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Receipt</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECEIPTS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="grid size-8 shrink-0 place-items-center rounded bg-muted">
                        <Receipt className="size-4 text-muted-foreground" />
                      </div>
                      <span className="whitespace-nowrap font-medium">{r.file}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.vendor}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">{r.amount}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        r.status === 'Matched'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-amber-500/15 text-amber-600',
                      )}
                    >
                      {r.status}
                    </span>
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
