'use client';

import { ExternalLink, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type KeyStatus = 'Active' | 'Revoked';
type HookStatus = 'Active' | 'Disabled';

type ApiKey = {
  name: string;
  token: string;
  created: string;
  lastUsed: string;
  status: KeyStatus;
};

type Webhook = {
  url: string;
  events: string;
  status: HookStatus;
  lastDelivery: string;
};

const API_KEYS: ApiKey[] = [
  {
    name: 'Production',
    token: 'sk_live_••••••••3f9a',
    created: '12 Jan 2026',
    lastUsed: '2m ago',
    status: 'Active',
  },
  {
    name: 'Zapier sync',
    token: 'sk_live_••••••••a71c',
    created: '03 Mar 2026',
    lastUsed: '1h ago',
    status: 'Active',
  },
  {
    name: 'Mobile app',
    token: 'sk_live_••••••••9d20',
    created: '28 Jun 2026',
    lastUsed: 'Yesterday',
    status: 'Active',
  },
  {
    name: 'Legacy (read-only)',
    token: 'sk_test_••••••••4e88',
    created: '17 Aug 2025',
    lastUsed: '—',
    status: 'Revoked',
  },
];

const WEBHOOKS: Webhook[] = [
  {
    url: 'https://rimba.example.com/hooks/orders',
    events: 'invoice.paid, payment.failed',
    status: 'Active',
    lastDelivery: '2m ago',
  },
  {
    url: 'https://rimba.example.com/hooks/leads',
    events: 'lead.created, deal.won',
    status: 'Active',
    lastDelivery: '15m ago',
  },
  {
    url: 'https://ops.rimba.example.com/webhook',
    events: 'invoice.overdue, member.invited',
    status: 'Disabled',
    lastDelivery: '—',
  },
];

const EVENT_TYPES = [
  'lead.created',
  'deal.won',
  'invoice.paid',
  'invoice.overdue',
  'payment.failed',
  'member.invited',
];

const KEY_STATUS_STYLES: Record<KeyStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-600',
  Revoked: 'bg-muted text-muted-foreground',
};

const HOOK_STATUS_STYLES: Record<HookStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-600',
  Disabled: 'bg-muted text-muted-foreground',
};

export default function DevelopersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Developers</h1>
          <p className="text-sm text-muted-foreground">
            API keys and webhooks for your integrations.
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <ExternalLink className="size-4" />
          API docs
        </Button>
      </div>

      <Tabs defaultValue="keys">
        <TabsList>
          <TabsTrigger value="keys">API keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="mt-2 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Keep your secret keys safe — treat them like passwords. Never
              commit them to source control or expose them in client-side code.
            </p>
            <Button size="sm">
              <Plus className="size-4" />
              Create key
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {API_KEYS.map((k) => (
                    <TableRow key={k.name}>
                      <TableCell className="font-medium">{k.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {k.token}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {k.created}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {k.lastUsed}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            KEY_STATUS_STYLES[k.status],
                          )}
                        >
                          {k.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={k.status === 'Revoked'}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-2 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Endpoints receive an HTTP POST callback whenever a subscribed
              event fires in your workspace.
            </p>
            <Button size="sm">
              <Plus className="size-4" />
              Add endpoint
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {WEBHOOKS.map((w) => (
                    <TableRow key={w.url}>
                      <TableCell className="font-mono text-xs">
                        {w.url}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {w.events}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            HOOK_STATUS_STYLES[w.status],
                          )}
                        >
                          {w.status}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {w.lastDelivery}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
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
              <CardTitle>Available events</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((e) => (
                <Badge key={e} variant="secondary" className="font-mono">
                  {e}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
