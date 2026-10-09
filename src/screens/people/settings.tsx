import { Banknote, Bell, Building2, CalendarClock, Plane } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard } from '@/components/bento/bento';
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

type ToggleRow = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
};

const NOTIFICATIONS: ToggleRow[] = [
  {
    id: 'notify-leave',
    label: 'Leave & claim requests',
    description: 'Alert approvers the moment a request comes in.',
    checked: true,
  },
  {
    id: 'notify-payslip',
    label: 'Payslip ready',
    description: 'Tell staff when the monthly payslip is published.',
    checked: true,
  },
  {
    id: 'notify-docexpiry',
    label: 'Document expiry',
    description: 'Flag expiring permits, passports and EA forms early.',
    checked: true,
  },
  {
    id: 'notify-birthday',
    label: 'Birthdays & anniversaries',
    description: 'A friendly nudge for team milestones.',
    checked: false,
  },
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

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Settings"
        subtitle="HR policies & workspace preferences, Saudara."
      />

      <BentoGrid>
        {/* Company & HR policy */}
        <BentoCard
          title="Company & HR policy"
          subtitle="Your organisation details"
          icon={Building2}
          className="col-span-2 md:col-span-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company name</Label>
              <Input id="company-name" defaultValue="Rimba Ventures Sdn Bhd" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ssm-no">SSM registration no.</Label>
              <Input id="ssm-no" defaultValue="202201012345 (1456789-A)" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hr-email">HR contact email</Label>
              <Input id="hr-email" type="email" defaultValue="hr@rimbaventures.com" />
            </div>
          </div>
        </BentoCard>

        {/* Leave entitlements */}
        <BentoCard
          title="Leave entitlements"
          subtitle="Annual allocations and approvals"
          icon={Plane}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="annual-leave">Annual (days)</Label>
                <Input id="annual-leave" defaultValue="16" inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical-leave">Medical / MC (days)</Label>
                <Input id="medical-leave" defaultValue="14" inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency-leave">Emergency (days)</Label>
                <Input id="emergency-leave" defaultValue="3" inputMode="numeric" />
              </div>
            </div>
            <div>
              <ToggleItem
                row={{ id: 'carry-forward', label: 'Allow carry-forward', checked: true }}
              />
              <ToggleItem
                row={{
                  id: 'manager-approval',
                  label: 'Manager approval required',
                  checked: true,
                }}
              />
            </div>
          </div>
        </BentoCard>

        {/* Payroll — statutory rates */}
        <BentoCard
          title="Payroll & statutory rates"
          subtitle="EPF / SOCSO / EIS / PCB"
          icon={Banknote}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pay-day">Pay day</Label>
                <Select defaultValue="28">
                  <SelectTrigger id="pay-day" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25th</SelectItem>
                    <SelectItem value="28">28th</SelectItem>
                    <SelectItem value="last">Last day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eis-rate">EIS rate (%)</Label>
                <Input id="eis-rate" defaultValue="0.2" inputMode="decimal" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="epf-employee">EPF / KWSP employee (%)</Label>
                <Input id="epf-employee" defaultValue="11" inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="epf-employer">EPF / KWSP employer (%)</Label>
                <Input id="epf-employer" defaultValue="13" inputMode="numeric" />
              </div>
            </div>
            <div>
              <ToggleItem
                row={{
                  id: 'auto-calc',
                  label: 'Auto-calculate EPF, SOCSO, EIS & PCB',
                  description: 'SOCSO and PCB follow the latest LHDN and PERKESO schedules.',
                  checked: true,
                }}
              />
              <ToggleItem
                row={{ id: 'email-payslips', label: 'Email payslips to staff', checked: true }}
              />
            </div>
          </div>
        </BentoCard>

        {/* Working days & hours */}
        <BentoCard
          title="Working days & hours"
          subtitle="How the team week is structured"
          icon={CalendarClock}
          className="col-span-2 md:col-span-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="space-y-2">
              <Label htmlFor="start-time">Start time</Label>
              <Input id="start-time" defaultValue="09:00" />
            </div>
          </div>
        </BentoCard>

        {/* Notifications */}
        <BentoCard
          title="Notifications"
          subtitle="Keep the team in the loop"
          icon={Bell}
          className="col-span-2 md:col-span-12"
        >
          <div className="grid gap-x-8 md:grid-cols-2">
            {NOTIFICATIONS.map((row) => (
              <ToggleItem key={row.id} row={row} />
            ))}
          </div>
        </BentoCard>
      </BentoGrid>

      <div className="mt-4 flex justify-end">
        <Button>Save changes</Button>
      </div>
    </ScreenContainer>
  );
}
