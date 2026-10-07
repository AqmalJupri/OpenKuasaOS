import { Check, Minus, Plus, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const PERMISSION_ROLES = ['Owner', 'Admin', 'Member', 'Viewer'] as const;

type PermissionRole = (typeof PERMISSION_ROLES)[number];

const PERMISSIONS: { capability: string; allow: PermissionRole[] }[] = [
  { capability: 'View dashboards', allow: ['Owner', 'Admin', 'Member', 'Viewer'] },
  { capability: 'Manage contacts & deals', allow: ['Owner', 'Admin', 'Member'] },
  { capability: 'Run AI ad campaigns', allow: ['Owner', 'Admin', 'Member'] },
  { capability: 'Approve leave & claims', allow: ['Owner', 'Admin'] },
  { capability: 'Manage billing & plan', allow: ['Owner', 'Admin'] },
  { capability: 'Invite & manage members', allow: ['Owner', 'Admin'] },
  { capability: 'Manage API keys & webhooks', allow: ['Owner'] },
  { capability: 'Delete workspace', allow: ['Owner'] },
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

      <div className="space-y-8">
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

        <Card>
          <CardHeader>
            <CardTitle>Invite a member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="name@company.com"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select defaultValue="member">
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full sm:w-auto">
                <Send className="size-4" />
                Send invite
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              They&apos;ll get an email to join Rimba Ventures Sdn Bhd.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles &amp; permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Capability</TableHead>
                    {PERMISSION_ROLES.map((role) => (
                      <TableHead key={role} className="text-center">
                        {role}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERMISSIONS.map((p) => (
                    <TableRow key={p.capability}>
                      <TableCell className="font-medium">
                        {p.capability}
                      </TableCell>
                      {PERMISSION_ROLES.map((role) => (
                        <TableCell key={role} className="text-center">
                          {p.allow.includes(role) ? (
                            <Check
                              className="mx-auto size-4 text-primary"
                              aria-label="Allowed"
                            />
                          ) : (
                            <Minus
                              className="mx-auto size-4 text-muted-foreground"
                              aria-label="Not allowed"
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
