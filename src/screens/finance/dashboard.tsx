import { HandCoins, TrendingUp, Wallet, Receipt } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type InvoiceStatus = 'Paid' | 'Sent' | 'Overdue';

type Invoice = {
  id: string;
  customer: string;
  total: string;
  status: InvoiceStatus;
};

const INVOICES: Invoice[] = [
  { id: 'INV-1042', customer: 'Aisyah Trading', total: 'RM 1,240', status: 'Paid' },
  { id: 'INV-1041', customer: 'Zaki Enterprise', total: 'RM 3,500', status: 'Sent' },
  { id: 'INV-1040', customer: 'Nurul Boutique', total: 'RM 8,900', status: 'Overdue' },
  { id: 'INV-1039', customer: 'Lim Hardware', total: 'RM 2,100', status: 'Paid' },
];

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-600',
  Sent: 'bg-amber-500/15 text-amber-600',
  Overdue: 'bg-red-500/15 text-red-600',
};

const AGEING = [
  { id: 'INV-1040', customer: 'Nurul Boutique', balance: 'RM 4,200', overdue: '12 days' },
  { id: 'INV-1041', customer: 'Zaki Enterprise', balance: 'RM 3,500', overdue: 'Not due' },
  { id: 'INV-1038', customer: 'Siti Decor', balance: 'RM 9,200', overdue: 'Not due' },
];

const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const BAR_HEIGHTS = [55, 70, 60, 80, 72, 88];

const ACCOUNTS = [
  { name: 'Main Bank Account', type: 'bank', balance: 'RM 72,400' },
  { name: 'Cash', type: 'cash', balance: 'RM 11,800' },
];

function StatusPill({ status }: { status: InvoiceStatus }) {
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

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Your financial overview · October 2026."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Cash Position"
          value="RM 84,200"
          note="2 bank & cash accounts"
          icon={Wallet}
          tone="primary"
        />
        <StatCard
          label="Sales This Month"
          value="RM 42,800"
          note="Expenses RM 18,400"
          icon={Receipt}
          tone="blue"
        />
        <StatCard
          label="Profit This Month"
          value="RM 24,400"
          icon={TrendingUp}
          tone="green"
        />
        <StatCard
          label="To Collect"
          value="RM 16,900"
          note="Overdue RM 4,200"
          icon={HandCoins}
          tone="amber"
        />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVOICES.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.id}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {inv.customer}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {inv.total}
                      </TableCell>
                      <TableCell>
                        <StatusPill status={inv.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Needs Collecting · AR Ageing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Overdue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AGEING.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {row.customer}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {row.balance}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'whitespace-nowrap',
                          row.overdue === 'Not due'
                            ? 'text-muted-foreground'
                            : 'font-medium text-red-600',
                        )}
                      >
                        {row.overdue}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cashflow (last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-2">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={MONTHS[i]}
                  className="flex-1 rounded-t-sm bg-primary"
                  style={{ height: `${h}%` }}
                  title={`${MONTHS[i]}: ${h}%`}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-2 text-[10px] text-muted-foreground">
              {MONTHS.map((m) => (
                <span key={m} className="flex-1 text-center">
                  {m}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank &amp; Cash Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ACCOUNTS.map((a) => (
                    <TableRow key={a.name}>
                      <TableCell className="whitespace-nowrap font-medium">
                        {a.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {a.type}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {a.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground">
              Owed to suppliers:{' '}
              <span className="font-medium text-foreground">RM 9,300</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </ScreenContainer>
  );
}
