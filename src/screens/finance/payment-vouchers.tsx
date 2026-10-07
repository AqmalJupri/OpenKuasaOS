import { Plus, Wallet, Hash, Clock, Truck } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
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

type Voucher = {
  id: string;
  date: string;
  no: string;
  to: string;
  account: string;
  amount: string;
  status: 'Paid' | 'Pending';
};

const VOUCHERS: Voucher[] = [
  { id: '1', date: '03 Oct 2026', no: 'PV-2026-0088', to: 'Lim Hardware Sdn Bhd', account: 'Main Bank', amount: 'RM 3,450.00', status: 'Paid' },
  { id: '2', date: '02 Oct 2026', no: 'PV-2026-0087', to: 'Tenaga Nasional Berhad', account: 'Main Bank', amount: 'RM 1,280.00', status: 'Paid' },
  { id: '3', date: '01 Oct 2026', no: 'PV-2026-0086', to: 'Syarikat Ramli & Anak', account: 'Main Bank', amount: 'RM 2,200.00', status: 'Pending' },
  { id: '4', date: '30 Sep 2026', no: 'PV-2026-0085', to: 'Printhub Solutions', account: 'Main Bank', amount: 'RM 640.00', status: 'Paid' },
  { id: '5', date: '28 Sep 2026', no: 'PV-2026-0084', to: 'Kedai Kain Kak Siti', account: 'Main Bank', amount: 'RM 5,900.00', status: 'Paid' },
  { id: '6', date: '26 Sep 2026', no: 'PV-2026-0083', to: 'Wong Packaging Enterprise', account: 'Main Bank', amount: 'RM 1,730.00', status: 'Paid' },
];

export default function PaymentVouchersScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payment Vouchers"
        subtitle="Money paid out."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Voucher
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Paid (MTD)" value="RM 19,600" icon={Wallet} tone="primary" />
        <StatCard label="Count" value="11" icon={Hash} tone="blue" />
        <StatCard label="Pending" value="RM 2,200" icon={Clock} tone="amber" />
        <StatCard label="Suppliers" value="6" icon={Truck} tone="green" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>No.</TableHead>
                <TableHead>Paid To</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VOUCHERS.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{v.date}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">{v.no}</TableCell>
                  <TableCell className="whitespace-nowrap">{v.to}</TableCell>
                  <TableCell className="whitespace-nowrap">{v.account}</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">{v.amount}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        v.status === 'Paid'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-amber-500/15 text-amber-600',
                      )}
                    >
                      {v.status}
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
