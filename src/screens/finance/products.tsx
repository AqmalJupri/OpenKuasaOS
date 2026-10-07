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

type ItemType = 'Product' | 'Service';
type ItemStatus = 'Active' | 'Inactive';

type Item = {
  id: string;
  name: string;
  sku: string;
  type: ItemType;
  price: string;
  tax: string;
  status: ItemStatus;
};

const ITEMS: Item[] = [
  { id: '1', name: 'Consultation — 1hr', sku: 'SRV-001', type: 'Service', price: 'RM 250.00', tax: 'SST 6%', status: 'Active' },
  { id: '2', name: 'Website Package', sku: 'SRV-002', type: 'Service', price: 'RM 3,500.00', tax: 'SST 6%', status: 'Active' },
  { id: '3', name: 'Monthly Bookkeeping', sku: 'SRV-003', type: 'Service', price: 'RM 600.00', tax: 'SST 6%', status: 'Active' },
  { id: '4', name: 'Printer Ink', sku: 'PRD-010', type: 'Product', price: 'RM 85.00', tax: 'SST 6%', status: 'Active' },
  { id: '5', name: 'A4 Paper (Ream)', sku: 'PRD-011', type: 'Product', price: 'RM 14.50', tax: 'SST 6%', status: 'Active' },
  { id: '6', name: 'Thermal Receipt Roll', sku: 'PRD-012', type: 'Product', price: 'RM 6.00', tax: 'None', status: 'Active' },
  { id: '7', name: 'Logo Design', sku: 'SRV-004', type: 'Service', price: 'RM 450.00', tax: 'SST 6%', status: 'Inactive' },
];

const STATUS_STYLES: Record<ItemStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-600',
  Inactive: 'bg-muted text-muted-foreground',
};

export default function ProductsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Products & Services"
        subtitle="Items you sell & buy."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Item
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search items…" className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="products">Products</SelectItem>
            <SelectItem value="services">Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ITEMS.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="whitespace-nowrap font-medium">{i.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">{i.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{i.type}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{i.price}</TableCell>
                  <TableCell className="whitespace-nowrap">{i.tax}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        STATUS_STYLES[i.status],
                      )}
                    >
                      {i.status}
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
