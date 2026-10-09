import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ATTENDANCE: { label: string; count: number; dot: string }[] = [
  { label: 'In', count: 16, dot: 'bg-emerald-500' },
  { label: 'Out', count: 2, dot: 'bg-blue-500' },
  { label: 'On Leave', count: 2, dot: 'bg-amber-500' },
  { label: 'Not In', count: 0, dot: 'bg-muted-foreground/40' },
];

const WEEK_BARS = [88, 94, 90, 96, 92, 100, 84];

const REQUESTS: { label: string; count: number }[] = [
  { label: 'Leave', count: 3 },
  { label: 'Claim', count: 2 },
  { label: 'Overtime', count: 1 },
  { label: 'Time-Off', count: 0 },
];

const ANNOUNCEMENTS: { title: string; snippet: string; time: string }[] = [
  {
    title: 'Company Townhall',
    snippet: 'This Friday 3pm, main hall',
    time: '2d',
  },
  {
    title: 'Hari Raya Holiday Notice',
    snippet: 'Office closed for Raya — plan leave',
    time: '1w',
  },
  {
    title: 'New Dental Benefit',
    snippet: 'RM500/yr from November',
    time: '2w',
  },
];

const OFF_THIS_WEEK: { name: string; dates: string }[] = [
  { name: 'Siti Aminah', dates: '6–8 Oct' },
  { name: 'Lim Wei Jie', dates: '9 Oct' },
];

const BIRTHDAYS: { name: string; date: string }[] = [
  { name: 'Nurul Huda', date: '18 Oct' },
];

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function PersonRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Welcome, Saudara"
        subtitle="HR operations summary — Wednesday, 07 October 2026"
      />

      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold tracking-tight">18 / 20</p>
              <ul className="space-y-2">
                {ATTENDANCE.map((a) => (
                  <li
                    key={a.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className={cn('size-2.5 rounded-full', a.dot)} />
                      {a.label}
                    </span>
                    <span className="font-medium">{a.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold tracking-tight">92%</p>
                <p className="text-sm text-muted-foreground">
                  present · 01–07 Oct
                </p>
              </div>
              <div className="flex h-12 items-end gap-1">
                {WEEK_BARS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {REQUESTS.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{r.label}</span>
                  <Badge variant={r.count > 0 ? 'default' : 'secondary'}>
                    {r.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {ANNOUNCEMENTS.map((a) => (
                <div
                  key={a.title}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.snippet}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {a.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Off This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {OFF_THIS_WEEK.map((p) => (
                <PersonRow key={p.name} name={p.name} meta={p.dates} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Birthdays This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {BIRTHDAYS.map((p) => (
                <PersonRow key={p.name} name={p.name} meta={p.date} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScreenContainer>
  );
}
