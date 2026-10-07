import { TrendingUp } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
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

const ROWS: FxRow[] = [
  { currency: 'USD', balance: '$2,400', rate: '4.42', value: 'RM 10,608', gain: 180, status: 'Open' },
  { currency: 'SGD', balance: 'S$1,200', rate: '3.28', value: 'RM 3,936', gain: 90, status: 'Open' },
  { currency: 'EUR', balance: '€800', rate: '4.80', value: 'RM 3,840', gain: 60, status: 'Open' },
  { currency: 'GBP', balance: '£500', rate: '5.60', value: 'RM 2,800', gain: 90, status: 'Open' },
];

function formatGain(n: number) {
  return `${n >= 0 ? '+' : '-'}RM ${Math.abs(n).toLocaleString('en-MY')}`;
}

export default function FxRevaluationScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="FX Revaluation"
        subtitle="Revalue foreign-currency balances."
      />

      <p className="mb-4 text-sm text-muted-foreground">Base currency: MYR</p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Unrealised Gain/Loss"
          value="RM +420"
          icon={TrendingUp}
          tone="green"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Balance (FCY)</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Value (MYR)</TableHead>
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
      </div>
    </ScreenContainer>
  );
}
