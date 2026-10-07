import { Banknote, Landmark, Receipt, Wallet } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Button } from '@/components/ui/button';
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

type ReturnStatus = 'Due' | 'Filed';

type SstPeriod = {
  id: string;
  period: string;
  taxable: string;
  rate: string;
  sst: string;
  status: ReturnStatus;
};

const PERIODS: SstPeriod[] = [
  { id: '1', period: 'Sep–Oct 2026', taxable: 'RM 42,800', rate: '6%', sst: 'RM 2,568', status: 'Due' },
  { id: '2', period: 'Jul–Aug 2026', taxable: 'RM 38,200', rate: '6%', sst: 'RM 2,292', status: 'Filed' },
  { id: '3', period: 'May–Jun 2026', taxable: 'RM 35,500', rate: '6%', sst: 'RM 2,130', status: 'Filed' },
  { id: '4', period: 'Mar–Apr 2026', taxable: 'RM 31,900', rate: '6%', sst: 'RM 1,914', status: 'Filed' },
];

const STATUS_STYLES: Record<ReturnStatus, string> = {
  Due: 'bg-amber-500/15 text-amber-600',
  Filed: 'bg-emerald-500/15 text-emerald-600',
};

export default function SstReportScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="SST Report"
        subtitle="Sales & Service Tax summary."
        actions={
          <>
            <Select defaultValue="sepoct">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sepoct">Sep–Oct 2026</SelectItem>
                <SelectItem value="julaug">Jul–Aug 2026</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">File Return</Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Taxable Sales" value="RM 42,800" icon={Banknote} tone="primary" />
        <StatCard label="SST Collected" value="RM 2,568" icon={Receipt} tone="green" />
        <StatCard label="SST Paid" value="RM 1,104" icon={Wallet} tone="blue" />
        <StatCard label="Net Payable" value="RM 1,464" icon={Landmark} tone="amber" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Taxable Amount</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">SST</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERIODS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap font-medium">{p.period}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{p.taxable}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{p.rate}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{p.sst}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        STATUS_STYLES[p.status],
                      )}
                    >
                      {p.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Returns are due by the last day of the month following the taxable period.
      </p>
    </ScreenContainer>
  );
}
