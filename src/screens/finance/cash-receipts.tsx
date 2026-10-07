import { Plus, HandCoins, Hash, Banknote, Landmark } from 'lucide-react';
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

type Receipt = {
  id: string;
  date: string;
  no: string;
  from: string;
  account: string;
  amount: string;
  status: string;
};

const RECEIPTS: Receipt[] = [
  { id: '1', date: '02 Oct 2026', no: 'RC-2026-0141', from: 'Aisyah Trading', account: 'Main Bank', amount: 'RM 6,800.00', status: 'Posted' },
  { id: '2', date: '01 Oct 2026', no: 'RC-2026-0140', from: 'Kedai Runcit Pak Din', account: 'Cash', amount: 'RM 850.00', status: 'Posted' },
  { id: '3', date: '30 Sep 2026', no: 'RC-2026-0139', from: 'Tan & Sons Enterprise', account: 'Main Bank', amount: 'RM 9,200.00', status: 'Posted' },
  { id: '4', date: '29 Sep 2026', no: 'RC-2026-0138', from: 'Nurul Boutique', account: 'Cash', amount: 'RM 1,450.00', status: 'Posted' },
  { id: '5', date: '27 Sep 2026', no: 'RC-2026-0137', from: 'Zaki Logistics Sdn Bhd', account: 'Main Bank', amount: 'RM 7,600.00', status: 'Posted' },
  { id: '6', date: '25 Sep 2026', no: 'RC-2026-0136', from: 'Mei Ling Bakery', account: 'Cash', amount: 'RM 900.00', status: 'Posted' },
];

export default function CashReceiptsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Cash Receipts"
        subtitle="Money received into cash & bank."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Receipt
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Received (MTD)" value="RM 28,400" icon={HandCoins} tone="green" />
        <StatCard label="Count" value="14" icon={Hash} tone="primary" />
        <StatCard label="Cash" value="RM 3,200" icon={Banknote} tone="blue" />
        <StatCard label="Bank" value="RM 25,200" icon={Landmark} tone="violet" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>No.</TableHead>
                <TableHead>Received From</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECEIPTS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">{r.no}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.from}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.account}</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">{r.amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
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
