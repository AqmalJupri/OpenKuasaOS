import { Plus, Search, Receipt, CircleCheck, Clock, Tags } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Expense = {
  id: string;
  date: string;
  category: string;
  vendor: string;
  amount: string;
  method: string;
  status: 'Approved' | 'Pending';
};

const CATEGORIES = ['Rent', 'Utilities', 'Marketing', 'Travel', 'Supplies', 'Salaries'];

const EXPENSES: Expense[] = [
  { id: '1', date: '03 Oct 2026', category: 'Rent', vendor: 'Menara Axis Management', amount: 'RM 4,500.00', method: 'Bank Transfer', status: 'Approved' },
  { id: '2', date: '02 Oct 2026', category: 'Utilities', vendor: 'Tenaga Nasional Berhad', amount: 'RM 1,280.00', method: 'FPX', status: 'Approved' },
  { id: '3', date: '01 Oct 2026', category: 'Marketing', vendor: 'Meta Ads Malaysia', amount: 'RM 2,200.00', method: 'Credit Card', status: 'Pending' },
  { id: '4', date: '30 Sep 2026', category: 'Travel', vendor: 'Grab Malaysia', amount: 'RM 186.00', method: 'E-Wallet', status: 'Approved' },
  { id: '5', date: '29 Sep 2026', category: 'Supplies', vendor: 'Printhub Solutions', amount: 'RM 640.00', method: 'Cash', status: 'Approved' },
  { id: '6', date: '28 Sep 2026', category: 'Salaries', vendor: 'Payroll - September', amount: 'RM 8,900.00', method: 'Bank Transfer', status: 'Approved' },
  { id: '7', date: '27 Sep 2026', category: 'Utilities', vendor: 'Unifi Business', amount: 'RM 94.00', method: 'Credit Card', status: 'Approved' },
];

export default function ExpensesScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Expenses"
        subtitle="Business expenses & spending."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Expense
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total (MTD)" value="RM 18,400" icon={Receipt} tone="primary" />
        <StatCard label="Approved" value="RM 16,200" icon={CircleCheck} tone="green" />
        <StatCard label="Pending" value="RM 2,200" icon={Clock} tone="amber" />
        <StatCard label="Categories" value="8" icon={Tags} tone="blue" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search expenses..." className="w-full pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EXPENSES.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{e.date}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{e.category}</TableCell>
                  <TableCell className="whitespace-nowrap">{e.vendor}</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">{e.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{e.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        e.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-amber-500/15 text-amber-600',
                      )}
                    >
                      {e.status}
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
