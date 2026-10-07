import { Clock, Hourglass, Users, Wallet } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type OtRecord = {
  name: string;
  date: string;
  hours: number;
  rate: string;
  amount: string;
  status: 'Approved' | 'Pending';
};

const RECORDS: OtRecord[] = [
  { name: 'Ahmad Zaki', date: '05 Oct', hours: 4, rate: '2.0x', amount: 'RM 200', status: 'Approved' },
  { name: 'Lim Wei Jie', date: '04 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Approved' },
  { name: 'Faiz Hakim', date: '03 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
  { name: 'Aisyah Rahim', date: '02 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Approved' },
  { name: 'Nurul Huda', date: '01 Oct', hours: 3, rate: '1.5x', amount: 'RM 120', status: 'Approved' },
  { name: 'Siti Aminah', date: '05 Oct', hours: 2, rate: '1.5x', amount: 'RM 80', status: 'Pending' },
];

export default function OvertimeScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Overtime" subtitle="Approved overtime records." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total OT Hours" value="84" icon={Clock} tone="primary" />
        <StatCard label="Approved Pay" value="RM 3,360" icon={Wallet} tone="green" />
        <StatCard label="Pending" value="12h" icon={Hourglass} tone="amber" />
        <StatCard label="Employees" value="6" icon={Users} tone="blue" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECORDS.map((r) => (
                <TableRow key={`${r.name}-${r.date}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {r.name.charAt(0)}
                      </span>
                      <span className="whitespace-nowrap font-medium">{r.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                  <TableCell className="tabular-nums">{r.hours}</TableCell>
                  <TableCell className="tabular-nums">{r.rate}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">
                    {r.amount}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        r.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-amber-500/15 text-amber-600',
                      )}
                    >
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
