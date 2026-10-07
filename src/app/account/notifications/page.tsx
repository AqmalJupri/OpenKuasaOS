import { AppWindow, Mail, Smartphone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const CHANNELS = [
  {
    id: 'email',
    icon: Mail,
    name: 'Email',
    help: 'Sent to jon@openkuasa.com',
    on: true,
  },
  {
    id: 'push',
    icon: Smartphone,
    name: 'Push',
    help: 'Mobile push on the OpenKuasa app',
    on: false,
  },
  {
    id: 'inapp',
    icon: AppWindow,
    name: 'In-app',
    help: 'The notification bell inside your dashboard',
    on: true,
  },
];

const EVENTS = [
  {
    name: 'New leads',
    help: 'When Jebat Ads / Reach captures a new lead',
    email: true,
    push: true,
    inapp: true,
  },
  {
    name: 'Deal stage changes',
    help: 'Movement across your Kasturi CRM pipeline',
    email: true,
    push: false,
    inapp: true,
  },
  {
    name: 'Payments & invoices',
    help: 'RM receipts, overdue invoices & LHDN e-Invoice status from Bendahara',
    email: true,
    push: true,
    inapp: true,
  },
  {
    name: 'Team activity',
    help: 'Lekiu leave & claims approvals waiting on you',
    email: false,
    push: false,
    inapp: true,
  },
  {
    name: 'Weekly summary',
    help: 'A Monday digest of last week across your workspace',
    email: true,
    push: false,
    inapp: false,
  },
  {
    name: 'Product updates',
    help: 'New features and improvements to OpenKuasa OS',
    email: false,
    push: false,
    inapp: true,
  },
  {
    name: 'Security alerts',
    help: 'New sign-ins and critical account changes — always on',
    email: true,
    push: true,
    inapp: true,
    locked: true,
  },
];

const TIMES = [
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '00:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Choose what we tell you and how.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {CHANNELS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.help}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={c.on} aria-label={c.name} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What you get notified about</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[28rem]">
                <div className="flex items-center gap-4 pb-2">
                  <div className="min-w-0 flex-1" />
                  <div className="flex shrink-0 gap-1 text-xs font-medium text-muted-foreground">
                    <span className="w-14 text-center">Email</span>
                    <span className="w-14 text-center">Push</span>
                    <span className="w-14 text-center">In-app</span>
                  </div>
                </div>
                <Separator />
                <div className="divide-y">
                  {EVENTS.map((e) => (
                    <div
                      key={e.name}
                      className="flex items-center gap-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{e.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {e.help}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <div className="flex w-14 justify-center">
                          <Checkbox
                            defaultChecked={e.email}
                            disabled={e.locked}
                            aria-label={`${e.name} — Email`}
                          />
                        </div>
                        <div className="flex w-14 justify-center">
                          <Checkbox
                            defaultChecked={e.push}
                            disabled={e.locked}
                            aria-label={`${e.name} — Push`}
                          />
                        </div>
                        <div className="flex w-14 justify-center">
                          <Checkbox
                            defaultChecked={e.inapp}
                            disabled={e.locked}
                            aria-label={`${e.name} — In-app`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Security alerts are always on and can&apos;t be turned off.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiet hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Pause notifications overnight</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll hold non-urgent alerts during these hours.
                </p>
              </div>
              <Switch defaultChecked aria-label="Enable quiet hours" />
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quiet-from">From</Label>
                <Select defaultValue="22:00">
                  <SelectTrigger id="quiet-from" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMES.map((t) => (
                      <SelectItem key={`from-${t}`} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-to">To</Label>
                <Select defaultValue="07:00">
                  <SelectTrigger id="quiet-to" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMES.map((t) => (
                      <SelectItem key={`to-${t}`} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Times shown in Asia/Kuala_Lumpur.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
