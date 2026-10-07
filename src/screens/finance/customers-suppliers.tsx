import { Plus, Search } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

type ContactType = 'Customer' | 'Supplier';
type ContactStatus = 'Active' | 'Inactive';

type Contact = {
  id: string;
  name: string;
  type: ContactType;
  email: string;
  phone: string;
  balance: string;
  status: ContactStatus;
};

const CONTACTS: Contact[] = [
  { id: '1', name: 'Aisyah Trading', type: 'Customer', email: 'accounts@aisyahtrading.my', phone: '+60 12-345 6789', balance: 'RM 1,240.00', status: 'Active' },
  { id: '2', name: 'Lim Hardware', type: 'Supplier', email: 'sales@limhardware.com.my', phone: '+60 3-7956 1234', balance: 'RM 2,300.00', status: 'Active' },
  { id: '3', name: 'Zaki Enterprise', type: 'Customer', email: 'zaki@zakient.my', phone: '+60 13-221 4455', balance: 'RM 3,500.00', status: 'Active' },
  { id: '4', name: 'Printhub', type: 'Supplier', email: 'orders@printhub.my', phone: '+60 3-5121 8800', balance: 'RM 540.00', status: 'Active' },
  { id: '5', name: 'Nurul Boutique', type: 'Customer', email: 'hello@nurulboutique.my', phone: '+60 11-2345 6781', balance: 'RM 860.00', status: 'Active' },
  { id: '6', name: 'TNB', type: 'Supplier', email: 'billing@tnb.com.my', phone: '+60 3-2296 5566', balance: 'RM 95.00', status: 'Active' },
  { id: '7', name: 'Siti Decor', type: 'Customer', email: 'siti@sitidecor.my', phone: '+60 19-887 6543', balance: 'RM 0.00', status: 'Inactive' },
];

const STATUS_STYLES: Record<ContactStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-600',
  Inactive: 'bg-muted text-muted-foreground',
};

export default function CustomersSuppliersScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Customers & Suppliers"
        subtitle="Your contacts for billing & procurement."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Add Contact
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contacts…" className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="suppliers">Suppliers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CONTACTS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {c.name.charAt(0)}
                      </span>
                      <span className="whitespace-nowrap font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.type}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{c.phone}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    {c.balance}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {c.type === 'Customer' ? 'owed' : 'payable'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        STATUS_STYLES[c.status],
                      )}
                    >
                      {c.status}
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
