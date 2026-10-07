import { Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type GoalStatus = 'On track' | 'At risk' | 'Done';

type Goal = {
  title: string;
  description: string;
  progress: number;
  status: GoalStatus;
};

const GOALS: Goal[] = [
  {
    title: 'Close 20 enterprise deals',
    description: 'Convert qualified enterprise pipeline into signed contracts by year end.',
    progress: 65,
    status: 'On track',
  },
  {
    title: 'Improve CSAT to 90%',
    description: 'Raise customer satisfaction through faster response and follow-up.',
    progress: 80,
    status: 'On track',
  },
  {
    title: 'Launch referral program',
    description: 'Roll out a customer referral programme with tracked rewards.',
    progress: 30,
    status: 'At risk',
  },
  {
    title: 'Complete sales certification',
    description: 'Finish the internal sales enablement certification track.',
    progress: 100,
    status: 'Done',
  },
];

const STATUS_STYLES: Record<GoalStatus, string> = {
  'On track': 'bg-emerald-500/15 text-emerald-600',
  'At risk': 'bg-amber-500/15 text-amber-600',
  Done: 'bg-emerald-500/15 text-emerald-600',
};

export default function MyGoalsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="My Goals"
        subtitle="Your objectives this quarter."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Add Goal
          </Button>
        }
      />

      <div className="space-y-4">
        {GOALS.map((g) => (
          <div
            key={g.title}
            className="space-y-3 rounded-xl border bg-card p-5 shadow-sm"
          >
            <div>
              <p className="font-medium">{g.title}</p>
              <p className="text-sm text-muted-foreground">{g.description}</p>
            </div>
            <Progress value={g.progress} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Due 31 Dec 2026</span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  STATUS_STYLES[g.status],
                )}
              >
                {g.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
