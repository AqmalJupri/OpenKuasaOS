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

type Journal = {
  date: string;
  no: string;
  description: string;
  debit: string | null;
  credit: string | null;
  status: 'Posted' | 'Draft';
};

const JOURNALS: Journal[] = [
  { date: '01 Oct', no: 'JV-101', description: 'Sales — Aisyah Trading', debit: 'RM 1,240', credit: null, status: 'Posted' },
  { date: '01 Oct', no: 'JV-102', description: 'Sales revenue — Aisyah Trading', debit: null, credit: 'RM 1,240', status: 'Posted' },
  { date: '03 Oct', no: 'JV-103', description: 'Office rent — October', debit: 'RM 3,500', credit: null, status: 'Posted' },
  { date: '03 Oct', no: 'JV-104', description: 'Bank payment — rent', debit: null, credit: 'RM 3,500', status: 'Posted' },
  { date: '05 Oct', no: 'JV-105', description: 'Utilities — TNB & Unifi', debit: 'RM 860', credit: null, status: 'Draft' },
  { date: '06 Oct', no: 'JV-106', description: 'Marketing accrual', debit: 'RM 400', credit: null, status: 'Draft' },
  { date: '06 Oct', no: 'JV-107', description: 'Accrued expenses payable', debit: null, credit: 'RM 1,260', status: 'Draft' },
];

function StatusPill({ status }: { status: Journal['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'Posted'
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {status}
    </span>
  );
}

export default function JournalsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Journals"
        subtitle="General ledger entries."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Journal
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>Journal No.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {JOURNALS.map((j) => (
                <TableRow key={j.no}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{j.date}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{j.no}</TableCell>
                  <TableCell className="whitespace-nowrap">{j.description}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{j.debit ?? ''}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{j.credit ?? ''}</TableCell>
                  <TableCell>
                    <StatusPill status={j.status} />
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
