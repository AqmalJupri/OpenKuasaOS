import { Megaphone } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Switch } from '@/components/ui/switch';

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
  return (
    <ScreenContainer>
      <PageHeader
        title="Ad Settings"
        subtitle="Configure your ad account, budgets, and automation."
      />
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Account</CardTitle>
            <CardDescription>Link Meta to run and sync ads.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget &amp; Spend</CardTitle>
            <CardDescription>Caps apply across all active campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation</CardTitle>
            <CardDescription>Let Jebat optimise while you sleep.</CardDescription>
          </CardHeader>
          <CardContent>
            {AUTOMATION.map((row) => (
              <ToggleItem key={row.id} row={row} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {NOTIFICATIONS.map((row) => (
              <ToggleItem key={row.id} row={row} />
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </ScreenContainer>
  );
}
