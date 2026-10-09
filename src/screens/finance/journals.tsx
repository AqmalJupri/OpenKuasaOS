import { BarChart3, BookOpen, Plus, Scale } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { BarGroup, Sparkline, type Series } from '@/components/charts';
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

type AccountClass = 'Assets' | 'Liabilities' | 'Income' | 'Expenses';
type JournalStatus = 'Posted' | 'Draft';

type JournalLine = {
  date: string;
  ref: string;
  account: string;
  klass: AccountClass;
  debit: string | null;
  credit: string | null;
  status: JournalStatus;
};

/** Double-entry lines — each ref balances (debits = credits). */
const JOURNAL_LINES: JournalLine[] = [
  { date: '01 Oct', ref: 'JV-101', account: 'Accounts Receivable', klass: 'Assets', debit: 'RM 1,240.00', credit: null, status: 'Posted' },
  { date: '01 Oct', ref: 'JV-101', account: 'Sales Revenue', klass: 'Income', debit: null, credit: 'RM 1,240.00', status: 'Posted' },
  { date: '03 Oct', ref: 'JV-102', account: 'Office Rent', klass: 'Expenses', debit: 'RM 3,500.00', credit: null, status: 'Posted' },
  { date: '03 Oct', ref: 'JV-102', account: 'Bank — Maybank', klass: 'Assets', debit: null, credit: 'RM 3,500.00', status: 'Posted' },
  { date: '05 Oct', ref: 'JV-103', account: 'Utilities (TNB & Unifi)', klass: 'Expenses', debit: 'RM 860.00', credit: null, status: 'Draft' },
  { date: '05 Oct', ref: 'JV-103', account: 'Accrued Expenses', klass: 'Liabilities', debit: null, credit: 'RM 860.00', status: 'Draft' },
  { date: '06 Oct', ref: 'JV-104', account: 'Marketing & Ads', klass: 'Expenses', debit: 'RM 400.00', credit: null, status: 'Draft' },
  { date: '06 Oct', ref: 'JV-104', account: 'Accrued Expenses', klass: 'Liabilities', debit: null, credit: 'RM 400.00', status: 'Draft' },
];

/** Gross movement (debit + credit) per account class, RM. */
const MOVEMENT_BY_CLASS = [
  { label: 'Expenses', amount: 4760 },
  { label: 'Assets', amount: 4740 },
  { label: 'Liabilities', amount: 1260 },
  { label: 'Income', amount: 1240 },
];
const MOVEMENT_SERIES: Series[] = [
  { key: 'amount', label: 'Movement (RM)', color: 'var(--chart-1)' },
];

const SPARK_ENTRIES = [2, 3, 3, 4, 3, 4, 4, 4];

function StatusPill({ status }: { status: JournalStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'Posted'
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */

export default function JournalsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Journals"
        subtitle="General ledger entries, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Journal
          </Button>
        }
      />

      <BentoGrid>
        {/* Ledger summary */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Entries this period"
            value="4"
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_ENTRIES}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Total debits" value="RM 6,000" delta="Dr" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Total credits" value="RM 6,000" delta="Cr" deltaTone="flat" />
        </BentoCard>
        <BentoCard
          title="Balance check"
          subtitle="Debits = Credits"
          icon={Scale}
          className="col-span-1 md:col-span-3"
        >
          <div className="flex items-center gap-2">
            <LiveDot active />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">In balance</p>
              <p className="truncate text-xs text-muted-foreground tabular-nums">
                RM 0.00 difference
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Movement by class + ledger table */}
        <BentoCard
          title="Movement by account class"
          subtitle="Gross Dr + Cr · RM"
          icon={BarChart3}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup
            data={MOVEMENT_BY_CLASS}
            series={MOVEMENT_SERIES}
            horizontal
            height={240}
          />
        </BentoCard>
        <BentoCard
          title="Journal entries"
          subtitle="Posted and draft lines this period"
          icon={BookOpen}
          className="col-span-2 md:col-span-8"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Date</TableHead>
                  <TableHead>Ref</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {JOURNAL_LINES.map((j, i) => (
                  <TableRow key={`${j.ref}-${i}`}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{j.date}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">{j.ref}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {j.account}
                      <span className="ml-2 text-xs text-muted-foreground">{j.klass}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">{j.debit ?? ''}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">{j.credit ?? ''}</TableCell>
                    <TableCell>
                      <StatusPill status={j.status} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 font-semibold">
                  <TableCell colSpan={3} className="whitespace-nowrap">
                    Total
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">RM 6,000.00</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">RM 6,000.00</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
