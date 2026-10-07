import { Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
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
  payee: string;
  purpose: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Pending';
};

const VOUCHERS: Voucher[] = [
  { id: 'PV-1042', payee: 'Aisyah Rahim', purpose: 'Salary — Oct', amount: 'RM 3,380', date: '28 Oct', status: 'Paid' },
  { id: 'PV-1041', payee: 'Faiz Hakim', purpose: 'Claim reimbursement', amount: 'RM 180', date: '06 Oct', status: 'Paid' },
  { id: 'PV-1040', payee: 'Ahmad Zaki', purpose: 'OT payment', amount: 'RM 200', date: '05 Oct', status: 'Pending' },
  { id: 'PV-1039', payee: 'Vendor — Printing', purpose: 'Office supplies', amount: 'RM 420', date: '03 Oct', status: 'Paid' },
  { id: 'PV-1038', payee: 'Nurul Huda', purpose: 'Travel claim', amount: 'RM 150', date: '01 Oct', status: 'Paid' },
];

function StatusPill({ status }: { status: Voucher['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'Paid'
          ? 'bg-emerald-500/15 text-emerald-600'
          : 'bg-amber-500/15 text-amber-600',
      )}
    >
      {status}
    </span>
  );
}

export default function PaymentVouchersScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payment Vouchers"
        subtitle="Salary & reimbursement vouchers."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Voucher
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Voucher #</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VOUCHERS.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">{v.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{v.payee}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{v.purpose}</TableCell>
                  <TableCell className="whitespace-nowrap font-semibold tabular-nums">{v.amount}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{v.date}</TableCell>
                  <TableCell>
                    <StatusPill status={v.status} />
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
