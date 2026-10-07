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

type Member = {
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  platforms: string;
  status: 'Active' | 'Invited';
};

const MEMBERS: Member[] = [
  {
    name: 'Jon D',
    email: 'jon@openkuasa.com',
    role: 'Owner',
    platforms: '6 platforms',
    status: 'Active',
  },
  {
    name: 'Aisyah Rahim',
    email: 'aisyah@openkuasa.com',
    role: 'Admin',
    platforms: '4 platforms',
    status: 'Active',
  },
  {
    name: 'Faiz Hakim',
    email: 'faiz@openkuasa.com',
    role: 'Member',
    platforms: '2 platforms',
    status: 'Active',
  },
  {
    name: 'Ahmad Zaki',
    email: 'ahmad@openkuasa.com',
    role: 'Member',
    platforms: '3 platforms',
    status: 'Active',
  },
  {
    name: 'Nurul Huda',
    email: 'nurul@openkuasa.com',
    role: 'Member',
    platforms: '0 platforms',
    status: 'Invited',
  },
];

export default function TeamPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground">
            People who can access your workspace.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4" />
          Add member
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MEMBERS.map((m) => (
                <TableRow key={m.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {m.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {m.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{m.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.platforms}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        m.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-amber-500/15 text-amber-600',
                      )}
                    >
                      {m.status}
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
