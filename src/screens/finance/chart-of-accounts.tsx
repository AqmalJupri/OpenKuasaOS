import { Layers, PieChart, Plus, Table2 } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, type Slice } from '@/components/charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AccountClass = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

type Account = {
  code: string;
  name: string;
  type: AccountClass;
  balance: string;
};

/* ---- chart of accounts (Rimba Ventures Sdn Bhd) ------------------- */

const ACCOUNTS: Account[] = [
  { code: '1000', name: 'Cash', type: 'Asset', balance: 'RM 11,800' },
  { code: '1100', name: 'Bank', type: 'Asset', balance: 'RM 80,500' },
  { code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 'RM 16,900' },
  { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 'RM 9,300' },
  { code: '2100', name: 'SST Payable', type: 'Liability', balance: 'RM 1,464' },
  { code: '3000', name: "Owner's Equity", type: 'Equity', balance: 'RM 150,000' },
  { code: '4000', name: 'Sales', type: 'Income', balance: 'RM 418,000' },
  { code: '5000', name: 'Cost of Sales', type: 'Expense', balance: 'RM 120,000' },
  { code: '6000', name: 'Rent', type: 'Expense', balance: 'RM 36,000' },
  { code: '6100', name: 'Salaries', type: 'Expense', balance: 'RM 180,000' },
  { code: '6200', name: 'Utilities', type: 'Expense', balance: 'RM 14,000' },
  { code: '6300', name: 'Marketing', type: 'Expense', balance: 'RM 22,000' },
];

/** Balances summed per account class (RM). */
const BALANCE_BY_CLASS: Slice[] = [
  { key: 'asset', label: 'Assets', value: 109_200, color: 'var(--chart-1)' },
  { key: 'liability', label: 'Liabilities', value: 10_764, color: 'var(--chart-4)' },
  { key: 'equity', label: 'Equity', value: 150_000, color: 'var(--chart-2)' },
  { key: 'income', label: 'Income', value: 418_000, color: 'var(--chart-5)' },
  { key: 'expense', label: 'Expenses', value: 372_000, color: 'var(--chart-3)' },
];

const CLASS_BADGE: Record<AccountClass, string> = {
  Asset: 'bg-[var(--chart-1)]/12 text-[var(--chart-1)]',
  Liability: 'bg-[var(--chart-4)]/12 text-[var(--chart-4)]',
  Equity: 'bg-[var(--chart-2)]/12 text-[var(--chart-2)]',
  Income: 'bg-[var(--chart-5)]/12 text-[var(--chart-5)]',
  Expense: 'bg-[var(--chart-3)]/12 text-[var(--chart-3)]',
};

/* ------------------------------------------------------------------ */

export default function ChartOfAccountsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Chart of Accounts"
        subtitle="Your double-entry account structure, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Account
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI / summary row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat label="Total accounts" value="12" delta="5 classes" onPrimary />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Assets" value="RM 109.2k" delta="+2.1%" deltaTone="up" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Liabilities" value="RM 10.8k" delta="−1.4%" deltaTone="up" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Net position" value="RM 98.4k" delta="assets − liabilities" deltaTone="flat" />
        </BentoCard>

        {/* Balance by class + accounts table */}
        <BentoCard
          title="Balance by class"
          subtitle="Across the ledger"
          icon={PieChart}
          className="col-span-2 md:col-span-4"
        >
          <DonutStat
            data={BALANCE_BY_CLASS}
            height={248}
            centerValue="12"
            centerLabel="accounts"
          />
        </BentoCard>

        <BentoCard
          title="Accounts"
          subtitle="Code, class and current balance"
          icon={Table2}
          action={
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="size-3.5" />
              grouped by class
            </span>
          }
          className="col-span-2 md:col-span-8"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Code</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACCOUNTS.map((a) => (
                  <TableRow key={a.code}>
                    <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                      {a.code}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">{a.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={CLASS_BADGE[a.type]}>
                        {a.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {a.balance}
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
