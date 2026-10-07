import { Search } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Input } from '@/components/ui/input';
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

type AuditAction = 'Created' | 'Updated' | 'Deleted';

type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  entity: string;
  details: string;
};

const ENTRIES: AuditEntry[] = [
  { id: '1', timestamp: '07 Oct 14:20', user: 'Jon D', action: 'Created', entity: 'INV-1042', details: 'Invoice RM 1,240 for Aisyah Trading' },
  { id: '2', timestamp: '07 Oct 11:05', user: 'Aisyah', action: 'Updated', entity: 'EXP-320', details: 'Amount RM 180 → RM 200' },
  { id: '3', timestamp: '06 Oct 16:40', user: 'Faiz', action: 'Deleted', entity: 'QT-214', details: 'Draft quotation removed' },
  { id: '4', timestamp: '06 Oct 10:12', user: 'Jon D', action: 'Created', entity: 'BILL-088', details: 'Bill RM 2,300 from Lim Hardware' },
  { id: '5', timestamp: '05 Oct 17:30', user: 'Aisyah', action: 'Updated', entity: 'INV-1038', details: 'Customer TIN corrected for LHDN resubmission' },
  { id: '6', timestamp: '05 Oct 09:48', user: 'Faiz', action: 'Created', entity: 'EXP-321', details: 'Expense RM 95 — TNB electricity' },
  { id: '7', timestamp: '04 Oct 15:22', user: 'Jon D', action: 'Updated', entity: 'PRD-010', details: 'Price RM 80 → RM 85' },
  { id: '8', timestamp: '03 Oct 13:07', user: 'Aisyah', action: 'Deleted', entity: 'EXP-317', details: 'Duplicate expense entry removed' },
];

const ACTION_STYLES: Record<AuditAction, string> = {
  Created: 'bg-emerald-500/15 text-emerald-600',
  Updated: 'bg-amber-500/15 text-amber-600',
  Deleted: 'bg-red-500/15 text-red-600',
};

export default function AuditTrailScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Audit Trail" subtitle="Every change, logged." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search activity…" className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            <SelectItem value="jon">Jon D</SelectItem>
            <SelectItem value="aisyah">Aisyah</SelectItem>
            <SelectItem value="faiz">Faiz</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ENTRIES.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{e.timestamp}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{e.user}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        ACTION_STYLES[e.action],
                      )}
                    >
                      {e.action}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{e.entity}</TableCell>
                  <TableCell className="min-w-64 text-muted-foreground">{e.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
