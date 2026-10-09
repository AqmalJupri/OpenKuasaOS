import { Coins, RefreshCw, TrendingUp } from 'lucide-react';
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

type FxRow = {
  currency: string;
  balance: string;
  rate: string;
  value: string;
  gain: number;
  status: string;
};

/* ---- FX revaluation (base currency MYR) -------------------------- */

const ROWS: FxRow[] = [
  { currency: 'USD', balance: '$2,400', rate: '4.42', value: 'RM 10,608', gain: 180, status: 'Open' },
  { currency: 'SGD', balance: 'S$1,200', rate: '3.28', value: 'RM 3,936', gain: 90, status: 'Open' },
  { currency: 'EUR', balance: '€800', rate: '4.80', value: 'RM 3,840', gain: 60, status: 'Open' },
];

/** Unrealised gain/loss on revaluation, by currency (RM). */
const GAIN_BY_CURRENCY = [
  { label: 'USD', gain: 180 },
  { label: 'SGD', gain: 90 },
  { label: 'EUR', gain: 60 },
];
const GAIN_SERIES: Series[] = [
  { key: 'gain', label: 'Gain/Loss (RM)', color: 'var(--chart-2)' },
];

function formatGain(n: number) {
  return `${n >= 0 ? '+' : '-'}RM ${Math.abs(n).toLocaleString('en-MY')}`;
}

/* ------------------------------------------------------------------ */

export default function FxRevaluationScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="FX Revaluation"
        subtitle="Revalue foreign-currency balances to MYR, Saudara."
        actions={
          <Button size="sm" variant="outline">
            <RefreshCw className="size-4" />
            Revalue
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat label="FX gain/loss" value="RM +330" delta="unrealised" onPrimary />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Revalued (MYR)" value="RM 18.4k" delta="3 balances" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Currencies" value="3" delta="USD · SGD · EUR" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Largest gain" value="RM +180" delta="USD" deltaTone="up" />
        </BentoCard>

        {/* Gain by currency + revaluation table */}
        <BentoCard
          title="Gain/loss by currency"
          subtitle="Against MYR base"
          icon={TrendingUp}
          className="col-span-2 md:col-span-4"
        >
          <BarGroup data={GAIN_BY_CURRENCY} series={GAIN_SERIES} height={224} />
        </BentoCard>

        <BentoCard
          title="Revaluation"
          subtitle="Foreign-currency balances at today's rates"
          icon={Coins}
          action={
            <span className="text-xs text-muted-foreground">Base: MYR</span>
          }
          className="col-span-2 md:col-span-8"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Balance (FCY)</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Revalued (MYR)</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((r) => (
                  <TableRow key={r.currency}>
                    <TableCell className="whitespace-nowrap font-medium">{r.currency}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">{r.balance}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">{r.rate}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">{r.value}</TableCell>
                    <TableCell
                      className={cn(
                        'whitespace-nowrap text-right font-medium tabular-nums',
                        r.gain >= 0 ? 'text-emerald-600' : 'text-red-600',
                      )}
                    >
                      {formatGain(r.gain)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {r.status}
                      </span>
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
