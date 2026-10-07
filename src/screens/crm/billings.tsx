import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const BAR_HEIGHTS = [40, 55, 48, 62, 70, 58, 80, 75, 66, 90, 72, 84];

const COLUMNS = ['Order #', 'Customer', 'Date', 'Type', 'Total', 'Status'];

type OrderStatus = 'Paid' | 'Pending' | 'Refunded';

type Order = {
  id: string;
  customer: string;
  date: string;
  type: string;
  total: string;
  status: OrderStatus;
};

const ORDERS: Order[] = [
  {
    id: '#1042',
    customer: 'Aisyah Trading',
    date: '07 Oct',
    type: 'Invoice',
    total: 'RM 1,240',
    status: 'Paid',
  },
  {
    id: '#1041',
    customer: 'Zaki Enterprise',
    date: '05 Oct',
    type: 'Retainer',
    total: 'RM 3,500',
    status: 'Paid',
  },
  {
    id: '#1040',
    customer: 'Nurul Boutique',
    date: '03 Oct',
    type: 'Invoice',
    total: 'RM 8,900',
    status: 'Pending',
  },
  {
    id: '#1039',
    customer: 'Ahmad F&B',
    date: '01 Oct',
    type: 'Invoice',
    total: 'RM 4,200',
    status: 'Paid',
  },
  {
    id: '#1038',
    customer: 'Faiz Studio',
    date: '28 Sep',
    type: 'Invoice',
    total: 'RM 2,100',
    status: 'Refunded',
  },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Refunded: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: OrderStatus }) {
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

function SalesCard({
  title,
  totalLabel,
  total,
  paid,
  unpaid,
  paidLabel,
}: {
  title: string;
  totalLabel: string;
  total: string;
  paid: string;
  unpaid: string;
  paidLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {totalLabel} · <span className="font-semibold text-foreground">{total}</span>
        </p>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold text-emerald-600">{paid}</p>
            <p className="text-xs text-muted-foreground">{paidLabel}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{unpaid}</p>
            <p className="text-xs text-muted-foreground">Unpaid</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BillingsScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Billings" subtitle="Orders, invoices & collections." />

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <SalesCard
              title="Today Sales"
              totalLabel="Today total"
              total="RM 1,240"
              paid="RM 1,240"
              paidLabel="Today paid"
              unpaid="RM 0"
            />
            <SalesCard
              title="All-time Sales"
              totalLabel="All-time total"
              total="RM 184,500"
              paid="RM 170,200"
              paidLabel="Paid"
              unpaid="RM 14,300"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales timeline (paid vs unpaid)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-end gap-1.5">
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={MONTHS[i]}
                    className="flex-1 rounded-t-sm bg-primary"
                    style={{ height: `${h}%` }}
                    title={`${MONTHS[i]}: ${h}%`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                {MONTHS.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-3 text-base font-semibold tracking-tight">
              Recent orders
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
                    {ORDERS.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {o.customer}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {o.date}
                        </TableCell>
                        <TableCell>{o.type}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {o.total}
                        </TableCell>
                        <TableCell>
                          <StatusPill status={o.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ScreenContainer>
  );
}
