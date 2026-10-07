import { Briefcase, CalendarCheck, FileCheck, Users } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STAGES = [
  { name: 'Applied', count: 128, pct: 100 },
  { name: 'Screening', count: 42, pct: 33 },
  { name: 'Interview', count: 18, pct: 14 },
  { name: 'Offer', count: 3, pct: 2 },
  { name: 'Hired', count: 2, pct: 2 },
];

const INTERVIEWS = [
  { name: 'Nurul Huda', role: 'Sales Executive', time: 'Today, 2:00 PM' },
  { name: 'Faiz Rahman', role: 'Graphic Designer', time: 'Tomorrow, 10:30 AM' },
  { name: 'Lim Wei Jie', role: 'Ops Lead', time: 'Thu, 3:00 PM' },
];

const APPLICANTS = [
  { name: 'Aisyah Karim', role: 'Sales Executive', applied: '2h ago', status: 'New' },
  { name: 'Ahmad Zulkifli', role: 'Customer Support', applied: '5h ago', status: 'Screening' },
  { name: 'Siti Nurhaliza', role: 'Graphic Designer', applied: 'Yesterday', status: 'New' },
  { name: 'Lim Mei Ling', role: 'Accountant', applied: '2d ago', status: 'Screening' },
];

const CLOSING = [
  { title: 'Customer Support', closes: 'closes in 5d', applicants: 22 },
  { title: 'Graphic Designer', closes: 'closes in 8d', applicants: 28 },
  { title: 'Sales Executive', closes: 'closes in 12d', applicants: 42 },
];

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Recruitment Overview"
        subtitle="Your hiring pipeline at a glance."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Jobs" value="5" icon={Briefcase} tone="primary" />
        <StatCard label="Candidates" value="128" icon={Users} tone="blue" />
        <StatCard
          label="Interviews This Week"
          value="9"
          icon={CalendarCheck}
          tone="amber"
        />
        <StatCard label="Offers Out" value="3" icon={FileCheck} tone="green" />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline by stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {STAGES.map((stage) => (
                <div key={stage.name} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-muted-foreground">
                    {stage.name}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${stage.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold">
                    {stage.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {INTERVIEWS.map((i) => (
                <div key={i.name} className="flex items-center gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {i.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {i.role}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {i.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {APPLICANTS.map((a) => (
                <div key={a.name} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.role} · {a.applied}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      a.status === 'New'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-amber-500/15 text-amber-600',
                    )}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs closing soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CLOSING.map((j) => (
                <div key={j.title} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.closes}</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {j.applicants} applicants
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScreenContainer>
  );
}
