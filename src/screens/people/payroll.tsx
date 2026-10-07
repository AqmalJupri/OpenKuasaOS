import { Banknote, PiggyBank, ShieldCheck, Wallet } from 'lucide-react';
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

type PayrollRow = {
  name: string;
  gross: number;
  epf: number;
  socso: number;
  pcb: number;
  net: number;
  status: 'Paid' | 'Pending';
};

const ROWS: PayrollRow[] = [
  { name: 'Aisyah Rahim', gross: 4000, epf: 440, socso: 60, pcb: 120, net: 3380, status: 'Paid' },
  { name: 'Faiz Hakim', gross: 3500, epf: 385, socso: 50, pcb: 90, net: 2975, status: 'Paid' },
  { name: 'Ahmad Zaki', gross: 6000, epf: 660, socso: 80, pcb: 280, net: 4980, status: 'Paid' },
  { name: 'Nurul Huda', gross: 4500, epf: 495, socso: 65, pcb: 160, net: 3780, status: 'Paid' },
  { name: 'Siti Aminah', gross: 2800, epf: 308, socso: 45, pcb: 40, net: 2407, status: 'Pending' },
  { name: 'Lim Wei Jie', gross: 3200, epf: 352, socso: 50, pcb: 60, net: 2738, status: 'Paid' },
];

const rm = (n: number) => `RM ${n.toLocaleString('en-MY')}`;

function StatusPill({ status }: { status: PayrollRow['status'] }) {
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

export default function PayrollScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Payroll"
        subtitle="Run and review monthly payroll · October 2026."
        actions={<Button size="sm">Run Payroll</Button>}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gross" value="RM 48,200" icon={Wallet} tone="primary" />
        <StatCard label="Net" value="RM 41,300" icon={Banknote} tone="green" />
        <StatCard label="EPF" value="RM 5,780" icon={PiggyBank} tone="blue" />
        <StatCard label="SOCSO" value="RM 620" icon={ShieldCheck} tone="amber" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>EPF</TableHead>
                <TableHead>SOCSO</TableHead>
                <TableHead>PCB</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="whitespace-nowrap font-medium">{r.name}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{rm(r.gross)}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{rm(r.epf)}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{rm(r.socso)}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{rm(r.pcb)}</TableCell>
                  <TableCell className="whitespace-nowrap font-semibold tabular-nums">
                    {rm(r.net)}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={r.status} />
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
