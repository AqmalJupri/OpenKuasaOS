import { GripVertical } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type ToggleRow = { id: string; label: string; checked: boolean };

const STAGES = [
  { name: 'Applied', count: 128 },
  { name: 'Screening', count: 54 },
  { name: 'Interview', count: 22 },
  { name: 'Offer', count: 6 },
  { name: 'Hired', count: 4 },
];

const FORM_FIELDS: ToggleRow[] = [
  { id: 'req-resume', label: 'Require resume/CV', checked: true },
  { id: 'req-cover', label: 'Require cover letter', checked: false },
  { id: 'ask-portfolio', label: 'Ask for portfolio URL', checked: true },
  { id: 'ask-salary', label: 'Ask for expected salary', checked: true },
];

const NOTIFICATIONS: ToggleRow[] = [
  { id: 'notify-new', label: 'Email me on new applications', checked: true },
  { id: 'notify-digest', label: 'Daily applicant digest', checked: true },
  { id: 'notify-interview', label: 'Interview reminders', checked: true },
];

const TEAM = [
  { name: 'Jon D', role: 'Admin' },
  { name: 'Ahmad Zaki', role: 'Hiring Manager' },
  { name: 'Faiz Hakim', role: 'Interviewer' },
];

function ToggleItem({ row }: { row: ToggleRow }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <Label htmlFor={row.id} className="font-medium">
        {row.label}
      </Label>
      <Switch id={row.id} defaultChecked={row.checked} />
    </div>
  );
}

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Settings" subtitle="Recruiting preferences." />
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiring Pipeline</CardTitle>
            <CardDescription>Stages candidates move through.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {STAGES.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-lg border p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{s.count}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              Add stage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>What candidates must provide.</CardDescription>
          </CardHeader>
          <CardContent>
            {FORM_FIELDS.map((row) => (
              <ToggleItem key={row.id} row={row} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what you get notified about.</CardDescription>
          </CardHeader>
          <CardContent>
            {NOTIFICATIONS.map((row) => (
              <ToggleItem key={row.id} row={row} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Team</CardTitle>
            <CardDescription>People involved in your hiring process.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {TEAM.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between gap-3 rounded-lg border p-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {m.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{m.name}</span>
                  </div>
                  <Badge variant="secondary">{m.role}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              Invite member
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </ScreenContainer>
  );
}
