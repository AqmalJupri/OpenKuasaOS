import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Scorecard = {
  name: string;
  department: string;
  overall: number;
  goals: number;
  attendance: number;
  peer: number;
};

const CARDS: Scorecard[] = [
  { name: 'Aisyah Rahim', department: 'Sales', overall: 88, goals: 85, attendance: 96, peer: 90 },
  { name: 'Ahmad Zaki', department: 'Finance', overall: 82, goals: 80, attendance: 92, peer: 85 },
  { name: 'Faiz Hakim', department: 'Operations', overall: 75, goals: 70, attendance: 95, peer: 80 },
  { name: 'Nurul Huda', department: 'Customer Support', overall: 91, goals: 90, attendance: 98, peer: 88 },
  { name: 'Siti Aminah', department: 'Marketing', overall: 64, goals: 55, attendance: 80, peer: 70 },
  { name: 'Lim Wei Jie', department: 'Engineering', overall: 78, goals: 75, attendance: 88, peer: 78 },
];

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

export default function ScorecardScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Scorecards" subtitle="Team performance at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.name} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.department}</p>
                </div>
              </div>
              <span className={cn('text-2xl font-bold tabular-nums', scoreColor(c.overall))}>
                {c.overall}
              </span>
            </div>
            <div className="space-y-3">
              <Metric label="Goals" value={c.goals} />
              <Metric label="Attendance" value={c.attendance} />
              <Metric label="Peer review" value={c.peer} />
            </div>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
