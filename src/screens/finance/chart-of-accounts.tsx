import { Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
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

type Account = {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';
  balance: string;
};

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

export default function ChartOfAccountsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Chart of Accounts"
        subtitle="Your account structure."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Account
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Code</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACCOUNTS.map((a) => (
                <TableRow key={a.code}>
                  <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{a.code}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{a.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{a.type}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{a.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
