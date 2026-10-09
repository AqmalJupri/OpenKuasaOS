import {
  AlertTriangle,
  Bell,
  CircleCheck,
  HeartPulse,
  Megaphone,
  Plug,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard } from '@/components/bento/bento';
import { RadialGauge } from '@/components/charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type ToggleRow = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
};

const AUTOMATION: ToggleRow[] = [
  {
    id: 'auto-budget',
    label: 'Auto-optimise budget to top performers',
    description: 'Shift spend toward the campaigns with the lowest cost per lead.',
    checked: true,
  },
  {
    id: 'auto-pause',
    label: 'Pause ads below your CTR threshold',
    description: 'Stop underperforming ads automatically to save budget.',
    checked: true,
  },
  {
    id: 'auto-reply',
    label: 'Auto-reply to new leads on WhatsApp',
    description: 'Send an instant greeting the moment a new lead comes in.',
    checked: false,
  },
];

const NOTIFICATIONS: ToggleRow[] = [
  { id: 'notify-daily', label: 'Email me a daily performance summary', checked: true },
  { id: 'notify-overspend', label: 'Alert me on budget overspend', checked: true },
];

type Status = 'Healthy' | 'Warning' | 'Action needed';

type Check = {
  name: string;
  description: string;
  status: Status;
};

const CHECKS: Check[] = [
  {
    name: 'Meta account connected',
    description: 'Link your Meta Business account',
    status: 'Action needed',
  },
  {
    name: 'Facebook Page linked',
    description: 'Select the Page to run ads from',
    status: 'Action needed',
  },
  {
    name: 'Lead forms configured',
    description: 'At least one active lead form',
    status: 'Warning',
  },
  {
    name: 'WhatsApp number verified',
    description: 'For auto follow-ups',
    status: 'Healthy',
  },
  {
    name: 'Billing method on file',
    description: 'Meta bills your card directly',
    status: 'Healthy',
  },
  {
    name: 'Conversions API / Pixel',
    description: 'Improves tracking accuracy',
    status: 'Warning',
  },
  {
    name: 'Domain verified',
    description: 'Required for some objectives',
    status: 'Healthy',
  },
];

const STATUS_PILL: Record<Status, string> = {
  Healthy: 'bg-emerald-500/15 text-emerald-600',
  Warning: 'bg-amber-500/15 text-amber-600',
  'Action needed': 'bg-red-500/15 text-red-600',
};

function StatusIcon({ status }: { status: Status }) {
  if (status === 'Healthy') {
    return <CircleCheck className="size-5 shrink-0 text-emerald-600" />;
  }
  if (status === 'Warning') {
    return <AlertTriangle className="size-5 shrink-0 text-amber-600" />;
  }
  return <XCircle className="size-5 shrink-0 text-red-600" />;
}

function ToggleItem({ row }: { row: ToggleRow }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <Label htmlFor={row.id} className="font-medium">
          {row.label}
        </Label>
        {row.description ? (
          <p className="text-sm text-muted-foreground">{row.description}</p>
        ) : null}
      </div>
      <Switch id={row.id} defaultChecked={row.checked} />
    </div>
  );
}

export default function AdSettingsScreen() {
  const issues = CHECKS.filter((c) => c.status === 'Action needed').length;

  return (
    <ScreenContainer>
      <PageHeader
        className="mb-4"
        title="Ad Settings"
        subtitle="Configure your ad account, budgets, and automation."
      />

      <BentoGrid>
        {/* Connected account */}
        <BentoCard
          title="Connected account"
          subtitle="Link Meta to run and sync ads"
          icon={Plug}
          className="col-span-2 md:col-span-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Megaphone className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">Meta Business</p>
                  <Badge variant="secondary">Not connected</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button size="sm">Connect</Button>
          </div>
        </BentoCard>

        {/* Budget & spend */}
        <BentoCard
          title="Budget & spend"
          subtitle="Caps apply across all active campaigns"
          icon={Wallet}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="daily-cap">Daily budget cap (RM)</Label>
                <Input id="daily-cap" defaultValue="150" inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-cap">Monthly cap (RM)</Label>
                <Input id="monthly-cap" defaultValue="3000" inputMode="numeric" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="MYR">
                <SelectTrigger id="currency" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MYR">Malaysian Ringgit (RM)</SelectItem>
                  <SelectItem value="SGD">Singapore Dollar (S$)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </BentoCard>

        {/* Automation */}
        <BentoCard
          title="Automation"
          subtitle="Let Jebat optimise while you sleep"
          icon={Zap}
          className="col-span-2 md:col-span-6"
        >
          {AUTOMATION.map((row) => (
            <ToggleItem key={row.id} row={row} />
          ))}
        </BentoCard>

        {/* Notifications */}
        <BentoCard
          title="Notifications"
          subtitle="Stay in the loop on spend & performance"
          icon={Bell}
          className="col-span-2 md:col-span-6"
        >
          {NOTIFICATIONS.map((row) => (
            <ToggleItem key={row.id} row={row} />
          ))}
        </BentoCard>

        {/* Health check (absorbed) */}
        <BentoCard
          title="Health check"
          subtitle="Setup checklist for your ad engine"
          icon={HeartPulse}
          className="col-span-2 md:col-span-12"
        >
          <div className="grid gap-4 md:grid-cols-12">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-background/50 p-4 md:col-span-4">
              <RadialGauge value={71} label="healthy" valueLabel="71%" height={200} />
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
                <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                <p className="text-sm font-medium">
                  {issues} issue{issues === 1 ? '' : 's'} need attention
                </p>
              </div>
            </div>
            <div className="divide-y rounded-lg border bg-background/50 md:col-span-8">
              {CHECKS.map((check) => (
                <div
                  key={check.name}
                  className="flex items-center justify-between gap-4 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <StatusIcon status={check.status} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{check.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {check.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                      STATUS_PILL[check.status],
                    )}
                  >
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      <div className="mt-4 flex justify-end">
        <Button>Save changes</Button>
      </div>
    </ScreenContainer>
  );
}
