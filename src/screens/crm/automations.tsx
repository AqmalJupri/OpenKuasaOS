import { CircleCheck, Clock, Play, Plus, Zap } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type Automation = {
  name: string;
  flow: string;
  runs: number;
  enabled: boolean;
};

const AUTOMATIONS: Automation[] = [
  {
    name: 'New lead welcome',
    flow: 'New lead → WhatsApp welcome',
    runs: 312,
    enabled: true,
  },
  {
    name: 'Stalled deal nudge',
    flow: 'No activity 3 days → notify owner',
    runs: 148,
    enabled: true,
  },
  {
    name: 'Appointment reminder',
    flow: '24h before → SMS reminder',
    runs: 540,
    enabled: true,
  },
  {
    name: 'Review request',
    flow: 'Deal won → ask for review',
    runs: 96,
    enabled: true,
  },
  {
    name: 'Win-back',
    flow: 'Churned 30 days → email offer',
    runs: 88,
    enabled: false,
  },
];

export default function AutomationsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Automations"
        subtitle="Trigger-based workflows that run themselves."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Automation
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active" value={5} icon={Zap} tone="primary" />
        <StatCard label="Runs (30d)" value="1,284" icon={Play} tone="blue" />
        <StatCard
          label="Success Rate"
          value="99.2%"
          icon={CircleCheck}
          tone="green"
        />
        <StatCard label="Time Saved" value="42h" icon={Clock} tone="violet" />
      </div>

      <div className="space-y-3">
        {AUTOMATIONS.map((a) => (
          <div
            key={a.name}
            className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Zap className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium">{a.name}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {a.flow}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {a.runs} runs
              </span>
              <Switch
                defaultChecked={a.enabled}
                aria-label={`Toggle ${a.name}`}
              />
            </div>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
