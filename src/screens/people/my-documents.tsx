import {
  CalendarClock,
  Download,
  FileSignature,
  FileText,
  PieChart,
  Upload,
} from 'lucide-react';
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

/* ---- mock data (Rimba Ventures Sdn Bhd · Saudara) ----------------- */

type DocType = 'Payslip' | 'Contract' | 'Letter' | 'Tax' | 'Benefits';
type DocStatus = 'Signed' | 'Pending signature' | 'Available' | 'Expiring';

type DocumentItem = {
  name: string;
  type: DocType;
  size: string;
  date: string;
  status: DocStatus;
};

const DOCUMENTS: DocumentItem[] = [
  { name: 'Updated NDA Agreement', type: 'Contract', size: '128 KB', date: '03 Oct 2026', status: 'Pending signature' },
  { name: 'Salary Increment Letter 2026', type: 'Letter', size: '82 KB', date: '02 Oct 2026', status: 'Pending signature' },
  { name: 'PCB / MTD Statement 2026', type: 'Tax', size: '64 KB', date: '30 Sep 2026', status: 'Available' },
  { name: 'Payslip — Sep 2026', type: 'Payslip', size: '112 KB', date: '25 Sep 2026', status: 'Available' },
  { name: 'Payslip — Aug 2026', type: 'Payslip', size: '110 KB', date: '25 Aug 2026', status: 'Available' },
  { name: 'Payslip — Jul 2026', type: 'Payslip', size: '109 KB', date: '25 Jul 2026', status: 'Available' },
  { name: 'Medical Card (AIA)', type: 'Benefits', size: '1.2 MB', date: 'Expires 31 Dec 2026', status: 'Expiring' },
  { name: 'EA Form 2025', type: 'Tax', size: '76 KB', date: '28 Feb 2026', status: 'Available' },
  { name: 'Confirmation Letter', type: 'Letter', size: '64 KB', date: '01 Apr 2019', status: 'Signed' },
  { name: 'Employment Contract', type: 'Contract', size: '240 KB', date: '01 Jan 2019', status: 'Signed' },
];

const TYPE_META: { key: string; type: DocType; label: string; color: string }[] = [
  { key: 'payslip', type: 'Payslip', label: 'Payslips', color: 'var(--chart-1)' },
  { key: 'letter', type: 'Letter', label: 'Letters', color: 'var(--chart-2)' },
  { key: 'contract', type: 'Contract', label: 'Contracts', color: 'var(--chart-3)' },
  { key: 'tax', type: 'Tax', label: 'Tax forms', color: 'var(--chart-4)' },
  { key: 'benefits', type: 'Benefits', label: 'Benefits', color: 'var(--chart-5)' },
];

const TYPE_MIX: Slice[] = TYPE_META.map((t) => ({
  key: t.key,
  label: t.label,
  value: DOCUMENTS.filter((d) => d.type === t.type).length,
  color: t.color,
})).filter((s) => s.value > 0);

/* KPI sparkline trends (last 6 periods) ------------------------------ */
const SPARK_DOCS = [4, 5, 6, 7, 9, 10];
const SPARK_PENDING = [0, 1, 0, 1, 2, 2];
const SPARK_EXPIRING = [0, 0, 1, 1, 1, 1];
const SPARK_PAYSLIPS = [1, 1, 2, 2, 3, 3];

const pendingCount = DOCUMENTS.filter((d) => d.status === 'Pending signature').length;
const expiringCount = DOCUMENTS.filter((d) => d.status === 'Expiring').length;
const payslipCount = DOCUMENTS.filter((d) => d.type === 'Payslip').length;

const STATUS_STYLES: Record<DocStatus, string> = {
  Signed: 'bg-emerald-500/15 text-emerald-600',
  'Pending signature': 'bg-amber-500/15 text-amber-600',
  Available: 'bg-sky-500/15 text-sky-600',
  Expiring: 'bg-red-500/15 text-red-600',
};

function StatusPill({ status }: { status: DocStatus }) {
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

export default function MyDocumentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="My Documents"
        subtitle="Your payslips, EA form, contract and letters, Saudara."
        actions={
          <Button variant="outline" size="sm">
            <Upload className="size-4" />
            Upload
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Documents"
            value={DOCUMENTS.length}
            delta="on file"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline data={SPARK_DOCS} color="var(--primary-foreground)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending signature"
            value={pendingCount}
            delta="action needed"
            deltaTone="down"
            chart={<Sparkline data={SPARK_PENDING} color="var(--chart-4)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Expiring soon"
            value={expiringCount}
            delta="within 90 days"
            deltaTone="down"
            chart={<Sparkline data={SPARK_EXPIRING} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Payslips"
            value={payslipCount}
            delta="last 3 months"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_PAYSLIPS} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>

        {/* By type + documents table */}
        <BentoCard
          title="By type"
          subtitle="Your document library"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={TYPE_MIX}
            height={240}
            centerValue={DOCUMENTS.length.toString()}
            centerLabel="documents"
          />
        </BentoCard>

        <BentoCard
          title="All documents"
          subtitle="Most recent first"
          icon={FileText}
          flush
          className="col-span-2 md:col-span-8"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DOCUMENTS.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          {d.status === 'Pending signature' ? (
                            <FileSignature className="size-4" />
                          ) : (
                            <FileText className="size-4" />
                          )}
                        </span>
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-medium">{d.name}</span>
                          {d.status === 'Pending signature' ? <LiveDot active /> : null}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {d.type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {d.date}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={d.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="size-4" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>
              {DOCUMENTS.length} documents · {payslipCount} payslips
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-4" />
              {pendingCount} awaiting your signature
            </span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
