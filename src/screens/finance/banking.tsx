import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Account = {
  name: string;
  type: 'Bank' | 'Cash';
  balance: string;
};

const ACCOUNTS: Account[] = [
  { name: 'Maybank — Current', type: 'Bank', balance: 'RM 72,400' },
  { name: 'CIMB — Savings', type: 'Bank', balance: 'RM 8,100' },
  { name: 'Cash', type: 'Cash', balance: 'RM 11,800' },
];

type TxnStatus = 'Reconciled' | 'Unreconciled';

type Txn = {
  id: string;
  date: string;
  description: string;
  account: string;
  moneyIn?: string;
  moneyOut?: string;
  status: TxnStatus;
};

const COLUMNS = [
  'Date',
  'Description',
  'Account',
  'Money In',
  'Money Out',
  'Status',
];

const TRANSACTIONS: Txn[] = [
  {
    id: 't1',
    date: '07 Oct 2026',
    description: 'Payment received — Aisyah Trading',
    account: 'Maybank — Current',
    moneyIn: 'RM 1,240.00',
    status: 'Unreconciled',
  },
  {
    id: 't2',
    date: '06 Oct 2026',
    description: 'Printhub Enterprise — BILL-0230',
    account: 'Maybank — Current',
    moneyOut: 'RM 1,450.00',
    status: 'Reconciled',
  },
  {
    id: 't3',
    date: '05 Oct 2026',
    description: 'Payment received — Zaki Enterprise',
    account: 'Maybank — Current',
    moneyIn: 'RM 3,500.00',
    status: 'Reconciled',
  },
  {
    id: 't4',
    date: '04 Oct 2026',
    description: 'Unifi Business — BILL-0227',
    account: 'CIMB — Savings',
    moneyOut: 'RM 299.00',
    status: 'Reconciled',
  },
  {
    id: 't5',
    date: '03 Oct 2026',
    description: 'Counter sales — cash deposit',
    account: 'Cash',
    moneyIn: 'RM 2,150.00',
    status: 'Unreconciled',
  },
  {
    id: 't6',
    date: '02 Oct 2026',
    description: 'Kedai Kertas Ah Seng — BILL-0224',
    account: 'Cash',
    moneyOut: 'RM 1,650.00',
    status: 'Reconciled',
  },
  {
    id: 't7',
    date: '01 Oct 2026',
    description: 'Bank charges — Maybank',
    account: 'Maybank — Current',
    moneyOut: 'RM 25.00',
    status: 'Unreconciled',
  },
];

const STATUS_STYLES: Record<TxnStatus, string> = {
  Reconciled: 'bg-emerald-500/15 text-emerald-600',
  Unreconciled: 'bg-amber-500/15 text-amber-600',
};

function StatusPill({ status }: { status: TxnStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function BankingScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Banking"
        subtitle="Accounts, balances & reconciliation."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {ACCOUNTS.map((a) => (
          <div
            key={a.name}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate font-semibold">{a.name}</p>
              <Badge variant="secondary">{a.type}</Badge>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{a.balance}</p>
            <p className="text-xs text-muted-foreground">Synced 2h ago</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-base font-semibold tracking-tight">
        Transactions
      </h2>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                {COLUMNS.map((c) => (
                  <TableHead key={c} className="whitespace-nowrap">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSACTIONS.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {t.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {t.description}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{t.account}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums text-emerald-600">
                    {t.moneyIn ?? ''}
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums text-red-600">
                    {t.moneyOut ?? ''}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={t.status} />
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
