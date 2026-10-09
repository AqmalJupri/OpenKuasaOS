import { Upload, Inbox, Receipt, PieChart, ScanLine } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, Sparkline, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
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

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type ReceiptStatus = 'Matched' | 'Review' | 'Unmatched';

type InboxReceipt = {
  id: string;
  file: string;
  vendor: string;
  date: string;
  amount: string;
  status: ReceiptStatus;
};

const RECEIPTS: InboxReceipt[] = [
  { id: '1', file: 'receipt-0042.jpg', vendor: 'Shell', date: '03 Oct 2026', amount: 'RM 142.50', status: 'Matched' },
  { id: '2', file: 'receipt-0041.jpg', vendor: 'TNB', date: '02 Oct 2026', amount: 'RM 318.20', status: 'Matched' },
  { id: '3', file: 'receipt-0040.png', vendor: 'Grab', date: '02 Oct 2026', amount: 'RM 36.00', status: 'Matched' },
  { id: '4', file: 'receipt-0039.jpg', vendor: 'Lazada', date: '01 Oct 2026', amount: 'RM 249.90', status: 'Review' },
  { id: '5', file: 'receipt-0038.pdf', vendor: 'Printhub', date: '30 Sep 2026', amount: 'RM 310.00', status: 'Matched' },
  { id: '6', file: 'receipt-0037.jpg', vendor: 'Kedai Runcit', date: '29 Sep 2026', amount: 'RM 123.40', status: 'Review' },
  { id: '7', file: 'receipt-0036.pdf', vendor: 'Nusantara Logistics', date: '28 Sep 2026', amount: 'RM 540.00', status: 'Unmatched' },
  { id: '8', file: 'receipt-0035.jpg', vendor: 'Lim Hardware', date: '27 Sep 2026', amount: 'RM 88.60', status: 'Matched' },
];

const STATUS_STYLES: Record<ReceiptStatus, string> = {
  Matched: 'bg-emerald-500/15 text-emerald-600',
  Review: 'bg-amber-500/15 text-amber-600',
  Unmatched: 'bg-red-500/15 text-red-600',
};

/* KPI sparkline trends ------------------------------------------------ */
const SPARK_REVIEW = [1, 3, 2, 4, 3, 2, 3, 2];
const SPARK_MATCHED = [2, 3, 3, 4, 4, 5, 4, 5];
const SPARK_UNMATCHED = [0, 1, 0, 2, 1, 1, 0, 1];

/** Inbox by match status — sums to 8. */
const BY_STATUS: Slice[] = [
  { key: 'matched', label: 'Matched', value: 5, color: 'var(--chart-2)' },
  { key: 'review', label: 'To review', value: 2, color: 'var(--chart-3)' },
  { key: 'unmatched', label: 'Unmatched', value: 1, color: 'var(--chart-4)' },
];

/* ------------------------------------------------------------------ */

export default function ReceiptsInboxScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Receipts Inbox"
        subtitle="Snap, upload and auto-extract receipts, Saudara."
        actions={
          <Button size="sm">
            <Upload className="size-4" />
            Upload Receipt
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row + small status donut */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="To review"
            value="2"
            delta="-1"
            onPrimary
            chart={
              <Sparkline data={SPARK_REVIEW} color="var(--primary-foreground)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Matched"
            value="5"
            delta="+1"
            deltaTone="up"
            chart={<Sparkline data={SPARK_MATCHED} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Unmatched"
            value="1"
            delta="+1"
            deltaTone="down"
            chart={<Sparkline data={SPARK_UNMATCHED} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard
          title="By status"
          subtitle="Current inbox"
          icon={PieChart}
          className="col-span-1 md:col-span-3"
        >
          <DonutStat
            data={BY_STATUS}
            height={150}
            showLegend={false}
            centerValue="8"
            centerLabel="receipts"
          />
        </BentoCard>

        {/* Inbox table with upload affordance */}
        <BentoCard
          title="Receipt inbox"
          subtitle="Auto-extracted, pending e-Invois match"
          icon={Inbox}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="px-4">
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center">
              <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                <ScanLine className="size-5" />
              </div>
              <p className="text-sm font-medium">
                Drag and drop receipts here, or snap a photo
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or PDF — auto-extracted and matched to bills and expenses
              </p>
              <Button variant="outline" size="sm" className="mt-1">
                <Upload className="size-4" />
                Browse files
              </Button>
            </div>
          </div>
          <div className="mt-3 overflow-x-auto">
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
                      <span className="flex items-center gap-2">
                        <LiveDot active={r.status === 'Matched'} />
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            STATUS_STYLES[r.status],
                          )}
                        >
                          {r.status}
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>Showing {RECEIPTS.length} receipts</span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
