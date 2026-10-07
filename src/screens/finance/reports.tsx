import {
  BarChart3,
  Scale,
  TrendingUp,
  ListChecks,
  BookOpen,
  Clock,
  ShieldCheck,
  Users,
  Wallet,
  Receipt,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Button } from '@/components/ui/button';

type Report = {
  name: string;
  description: string;
  icon: LucideIcon;
};

const REPORTS: Report[] = [
  { name: 'Profit & Loss', description: 'Revenue, costs and net profit for a period.', icon: BarChart3 },
  { name: 'Balance Sheet', description: 'Assets, liabilities and equity at a date.', icon: Scale },
  { name: 'Cash Flow', description: 'Cash moving in and out of your business.', icon: TrendingUp },
  { name: 'Trial Balance', description: 'Debit and credit totals for every account.', icon: ListChecks },
  { name: 'General Ledger', description: 'Every posted transaction by account.', icon: BookOpen },
  { name: 'Aged Receivables', description: 'Outstanding customer invoices by age.', icon: Clock },
  { name: 'Aged Payables', description: 'Unpaid supplier bills by age.', icon: Clock },
  { name: 'Tax Summary', description: 'SST collected and payable for filing.', icon: ShieldCheck },
  { name: 'Sales by Customer', description: 'Revenue breakdown for each customer.', icon: Users },
];

export default function ReportsScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Financial Reports" subtitle="P&L, balance sheet & more." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue (YTD)" value="RM 418,000" icon={Wallet} tone="green" />
        <StatCard label="Expenses (YTD)" value="RM 236,000" icon={Receipt} tone="amber" />
        <StatCard label="Net Profit" value="RM 182,000" icon={PiggyBank} tone="primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.name} className="space-y-2 rounded-xl border bg-card p-5 shadow-sm">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <r.icon className="size-5" />
            </div>
            <p className="font-semibold">{r.name}</p>
            <p className="text-sm text-muted-foreground">{r.description}</p>
            <Button variant="outline" size="sm" className="mt-1">
              View
            </Button>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
