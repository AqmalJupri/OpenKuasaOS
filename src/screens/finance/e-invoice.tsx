import { CheckCircle2, Clock, FileText, ShieldCheck, XCircle } from 'lucide-react';
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

type MyInvoisStatus = 'Validated' | 'Pending' | 'Rejected';

type EInvoice = {
  id: string;
  no: string;
  customer: string;
  date: string;
  amount: string;
  status: MyInvoisStatus;
  uuid: string;
};

const INVOICES: EInvoice[] = [
  { id: '1', no: 'INV-1042', customer: 'Aisyah Trading', date: '07 Oct 2026', amount: 'RM 1,240.00', status: 'Validated', uuid: 'a1b2…f9' },
  { id: '2', no: 'INV-1041', customer: 'Zaki Enterprise', date: '06 Oct 2026', amount: 'RM 3,500.00', status: 'Validated', uuid: 'c7d4…2e' },
  { id: '3', no: 'INV-1040', customer: 'Nurul Boutique', date: '06 Oct 2026', amount: 'RM 860.00', status: 'Pending', uuid: 'e9f0…41' },
  { id: '4', no: 'INV-1039', customer: 'Siti Decor', date: '05 Oct 2026', amount: 'RM 2,150.00', status: 'Validated', uuid: '3b8a…d7' },
  { id: '5', no: 'INV-1038', customer: 'Lim Hardware', date: '04 Oct 2026', amount: 'RM 4,720.00', status: 'Rejected', uuid: '9c21…b5' },
  { id: '6', no: 'INV-1037', customer: 'Printhub Sdn Bhd', date: '03 Oct 2026', amount: 'RM 540.00', status: 'Pending', uuid: '5d6e…a0' },
  { id: '7', no: 'INV-1036', customer: 'Aisyah Trading', date: '02 Oct 2026', amount: 'RM 1,980.00', status: 'Validated', uuid: 'f2a7…68' },
];

const STATUS_STYLES: Record<MyInvoisStatus, string> = {
  Validated: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Rejected: 'bg-red-500/15 text-red-600',
};

function StatusPill({ status }: { status: MyInvoisStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export default function EInvoiceScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="e-Invoice LHDN"
        subtitle="MyInvois submission & validation status."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Submitted" value="128" icon={FileText} tone="primary" />
        <StatCard label="Validated" value="124" icon={CheckCircle2} tone="green" />
        <StatCard label="Pending" value="3" icon={Clock} tone="amber" />
        <StatCard label="Rejected" value="1" icon={XCircle} tone="violet" />
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <ShieldCheck className="size-5 shrink-0 text-emerald-600" />
        <div className="min-w-0">
          <p className="font-medium">
            You&apos;re compliant — 124 of 128 invoices validated with LHDN.
          </p>
          <p className="text-sm text-muted-foreground">
            3 invoices are awaiting validation and 1 was rejected. Fix and resubmit it to stay compliant.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Invoice No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>MyInvois Status</TableHead>
                <TableHead>UUID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="whitespace-nowrap font-medium">{i.no}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.customer}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{i.date}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{i.amount}</TableCell>
                  <TableCell>
                    <StatusPill status={i.status} />
                  </TableCell>
                  <TableCell>
                    <code className="block max-w-32 truncate font-mono text-xs text-muted-foreground">
                      {i.uuid}
                    </code>
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
