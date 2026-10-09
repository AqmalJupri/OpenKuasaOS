import { ArrowLeftRight, Plus, Scale } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { BarGroup, type Series } from '@/components/charts';
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

type Contra = {
  date: string;
  no: string;
  party: string;
  receivable: string;
  payable: string;
  net: string;
  status: 'Posted' | 'Draft';
};

/* ---- contra entries (Rimba Ventures Sdn Bhd) --------------------- */

const CONTRAS: Contra[] = [
  { date: '06 Oct', no: 'CT-05', party: 'Lim Hardware', receivable: 'RM 2,100', payable: 'RM 1,800', net: 'RM 300', status: 'Posted' },
  { date: '28 Sep', no: 'CT-04', party: 'Syarikat Maju Jaya', receivable: 'RM 4,500', payable: 'RM 3,200', net: 'RM 1,300', status: 'Posted' },
  { date: '15 Sep', no: 'CT-03', party: 'Kedai Runcit Hasan', receivable: 'RM 960', payable: 'RM 960', net: 'RM 0', status: 'Posted' },
  { date: '02 Oct', no: 'CT-06', party: 'Tan & Sons Trading', receivable: 'RM 3,400', payable: 'RM 2,750', net: 'RM 650', status: 'Draft' },
];

/** Receivable vs payable offset by counter-party (RM). */
const OFFSET_BY_PARTY = [
  { label: 'Lim Hardware', receivable: 2100, payable: 1800 },
  { label: 'Maju Jaya', receivable: 4500, payable: 3200 },
  { label: 'Kedai Hasan', receivable: 960, payable: 960 },
  { label: 'Tan & Sons', receivable: 3400, payable: 2750 },
];
const OFFSET_SERIES: Series[] = [
  { key: 'receivable', label: 'Receivable', color: 'var(--chart-1)' },
  { key: 'payable', label: 'Payable', color: 'var(--chart-4)' },
];

function StatusPill({ status }: { status: Contra['status'] }) {
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

export default function ContraEntriesScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Contra Entries"
        subtitle="Offset receivables against payables, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Contra
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat label="Contra entries" value="4" delta="this period" onPrimary />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Matched amount" value="RM 8.7k" delta="offset" deltaTone="up" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Net offset" value="RM 2.3k" delta="residual" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Posted" value="3 / 4" delta="1 draft" deltaTone="flat" />
        </BentoCard>

        {/* Offset chart + entries table */}
        <BentoCard
          title="Receivable vs payable"
          subtitle="By counter-party"
          icon={Scale}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup
            data={OFFSET_BY_PARTY}
            series={OFFSET_SERIES}
            horizontal
            height={224}
            showLegend
          />
        </BentoCard>

        <BentoCard
          title="Contra entries"
          subtitle="Receivables netted against payables"
          icon={ArrowLeftRight}
          className="col-span-2 md:col-span-8"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Date</TableHead>
                  <TableHead>No.</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Receivable</TableHead>
                  <TableHead className="text-right">Payable</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CONTRAS.map((c) => (
                  <TableRow key={c.no}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{c.date}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">{c.no}</TableCell>
                    <TableCell className="whitespace-nowrap">{c.party}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">{c.receivable}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">{c.payable}</TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">{c.net}</TableCell>
                    <TableCell>
                      <StatusPill status={c.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
