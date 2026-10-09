import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
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

function ToggleItem({
  id,
  label,
  checked,
}: {
  id: string;
  label: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <Label htmlFor={id} className="font-medium">
        {label}
      </Label>
      <Switch id={id} defaultChecked={checked} />
    </div>
  );
}

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Settings"
        subtitle="HR policies & workspace preferences."
      />
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
            <CardDescription>Your organisation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company name</Label>
                <Input id="company-name" defaultValue="Rimba Ventures Sdn Bhd" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="working-days">Working days</Label>
                <Select defaultValue="monfri">
                  <SelectTrigger id="working-days" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monfri">Mon–Fri</SelectItem>
                    <SelectItem value="monsat">Mon–Sat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Policy</CardTitle>
            <CardDescription>Entitlements and approvals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="annual-leave">Annual leave entitlement (days)</Label>
              <Input
                id="annual-leave"
                defaultValue="16"
                inputMode="numeric"
                className="sm:w-64"
              />
            </div>
            <div>
              <ToggleItem id="carry-forward" label="Allow carry-forward" checked />
              <ToggleItem id="manager-approval" label="Manager approval required" checked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Week</CardTitle>
            <CardDescription>How your team&apos;s week is structured.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="week-starts">Week starts</Label>
                <Select defaultValue="mon">
                  <SelectTrigger id="week-starts" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mon">Monday</SelectItem>
                    <SelectItem value="sun">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-per-day">Hours per day</Label>
                <Input id="hours-per-day" defaultValue="8" inputMode="numeric" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll</CardTitle>
            <CardDescription>Pay schedule and statutory contributions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pay-day">Pay day</Label>
              <Select defaultValue="28">
                <SelectTrigger id="pay-day" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25th</SelectItem>
                  <SelectItem value="28">28th</SelectItem>
                  <SelectItem value="last">Last day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <ToggleItem id="auto-calc" label="Auto-calculate EPF & SOCSO" checked />
              <ToggleItem id="email-payslips" label="Email payslips to staff" checked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </ScreenContainer>
  );
}
