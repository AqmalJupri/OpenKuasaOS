import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

type Client = {
  name: string;
  plan: string;
  platforms: string;
  monthly: string;
  status: 'Active' | 'Paused';
};

const CLIENTS: Client[] = [
  {
    name: 'Aisyah Trading',
    plan: 'Growth',
    platforms: 'Reach, CRM',
    monthly: 'RM 299',
    status: 'Active',
  },
  {
    name: 'Zaki Enterprise',
    plan: 'Scale',
    platforms: 'All',
    monthly: 'RM 599',
    status: 'Active',
  },
  {
    name: 'Nurul Boutique',
    plan: 'Starter',
    platforms: 'CRM',
    monthly: 'RM 99',
    status: 'Active',
  },
  {
    name: 'Lim Hardware',
    plan: 'Growth',
    platforms: 'Finance',
    monthly: 'RM 299',
    status: 'Paused',
  },
];

export default function ClientsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage accounts you run on behalf of clients.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4" />
          Add client
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Monthly</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLIENTS.map((c) => (
                <TableRow key={c.name}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {c.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{c.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.platforms}
                  </TableCell>
                  <TableCell className="font-medium">{c.monthly}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        c.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-amber-500/15 text-amber-600',
                      )}
                    >
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
