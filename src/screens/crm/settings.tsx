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

const MEMBERS = [
  { name: 'Jon (You)', role: 'Owner' },
  { name: 'Aisyah', role: 'Sales' },
  { name: 'Faiz', role: 'Sales' },
];

const NOTIFICATIONS = [
  { id: 'notify-leads', label: 'Email me on new leads' },
  { id: 'notify-daily', label: 'Daily pipeline summary' },
  { id: 'notify-won', label: 'Deal-won celebrations' },
];

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Settings"
        subtitle="Workspace, pipeline & team preferences."
      />
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Basic details for your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input id="workspace-name" defaultValue="Kuasa Sdn Bhd" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="kl">
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kl">Asia/Kuala_Lumpur</SelectItem>
                    <SelectItem value="sg">Asia/Singapore</SelectItem>
                  </SelectContent>
                </Select>
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
            <CardTitle>Pipeline</CardTitle>
            <CardDescription>Defaults for your deals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-pipeline">Default pipeline</Label>
              <Select defaultValue="default">
                <SelectTrigger id="default-pipeline" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auto-archive">Auto-archive won/lost deals after</Label>
              <Select defaultValue="90">
                <SelectTrigger id="auto-archive" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start justify-between gap-4 py-2">
              <Label htmlFor="require-reason" className="font-medium">
                Require a reason when marking a deal Lost
              </Label>
              <Switch id="require-reason" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>People with access to this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-lg border p-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <p className="text-sm font-medium">{member.name}</p>
                  </div>
                  <Badge variant="secondary">{member.role}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              Invite member
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {NOTIFICATIONS.map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-4 py-2">
                <Label htmlFor={row.id} className="font-medium">
                  {row.label}
                </Label>
                <Switch id={row.id} defaultChecked />
              </div>
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
