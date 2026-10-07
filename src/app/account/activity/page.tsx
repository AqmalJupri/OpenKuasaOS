import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

type Category = 'Auth' | 'Billing' | 'Team' | 'Data' | 'Security';

type Entry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: Category;
  timestamp: string;
  ip: string;
};

const CATEGORY_STYLES: Record<Category, string> = {
  Auth: 'bg-muted text-muted-foreground',
  Billing: 'bg-emerald-500/15 text-emerald-600',
  Team: 'bg-amber-500/15 text-amber-600',
  Data: 'bg-muted text-muted-foreground',
  Security: 'bg-red-500/15 text-red-600',
};

const ENTRIES: Entry[] = [
  { id: 'a01', actor: 'Jon D', action: 'Signed in', target: 'Web · Kuala Lumpur', category: 'Auth', timestamp: '08 Oct 2026, 14:32', ip: '203.82.x.x' },
  { id: 'a02', actor: 'System', action: 'Failed sign-in attempt', target: 'jon@openkuasa.com', category: 'Security', timestamp: '08 Oct 2026, 09:07', ip: '—' },
  { id: 'a03', actor: 'Aisyah Rahim', action: 'Updated payment method', target: 'Card •••• 4242', category: 'Billing', timestamp: '07 Oct 2026, 17:21', ip: '115.164.x.x' },
  { id: 'a04', actor: 'Faiz Hakim', action: 'Downloaded invoice INV-2026-0912', target: 'INV-2026-0912', category: 'Billing', timestamp: '07 Oct 2026, 11:48', ip: '60.51.x.x' },
  { id: 'a05', actor: 'Jon D', action: 'Changed Faiz Hakim role to Member', target: 'Faiz Hakim', category: 'Team', timestamp: '06 Oct 2026, 16:05', ip: '203.82.x.x' },
  { id: 'a06', actor: 'Aisyah Rahim', action: 'Invited member nurul@openkuasa.com', target: 'nurul@openkuasa.com', category: 'Team', timestamp: '05 Oct 2026, 10:19', ip: '115.164.x.x' },
  { id: 'a07', actor: 'Ahmad Zaki', action: "Created API key 'Production'", target: 'API key', category: 'Security', timestamp: '04 Oct 2026, 15:52', ip: '175.139.x.x' },
  { id: 'a08', actor: 'Jon D', action: 'Enabled two-factor authentication', target: 'Account security', category: 'Security', timestamp: '04 Oct 2026, 09:40', ip: '203.82.x.x' },
  { id: 'a09', actor: 'Nurul Huda', action: 'Exported contacts (Reach)', target: '1,284 contacts', category: 'Data', timestamp: '03 Oct 2026, 14:11', ip: '42.189.x.x' },
  { id: 'a10', actor: 'Jon D', action: 'Updated company SST number', target: 'Rimba Ventures Sdn Bhd', category: 'Data', timestamp: '02 Oct 2026, 11:26', ip: '203.82.x.x' },
  { id: 'a11', actor: 'Aisyah Rahim', action: 'Approved leave request', target: 'Faiz Hakim · 2 days', category: 'Team', timestamp: '01 Oct 2026, 09:58', ip: '115.164.x.x' },
];

export default function ActivityPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity log</h1>
          <p className="text-sm text-muted-foreground">
            A record of actions across your workspace.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Select defaultValue="all-members">
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-members">All members</SelectItem>
            <SelectItem value="jon">Jon D</SelectItem>
            <SelectItem value="aisyah">Aisyah Rahim</SelectItem>
            <SelectItem value="faiz">Faiz Hakim</SelectItem>
            <SelectItem value="ahmad">Ahmad Zaki</SelectItem>
            <SelectItem value="nurul">Nurul Huda</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-actions">
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-actions">All actions</SelectItem>
            <SelectItem value="auth">Auth</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="30d">
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all-time">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ENTRIES.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback
                          className={cn(
                            'text-xs font-semibold',
                            e.actor === 'System'
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-primary/10 text-primary',
                          )}
                        >
                          {e.actor[0]}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold whitespace-nowrap">
                        {e.actor}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{e.action}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.target}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        CATEGORY_STYLES[e.category],
                      )}
                    >
                      {e.category}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {e.timestamp}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {e.ip}
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
