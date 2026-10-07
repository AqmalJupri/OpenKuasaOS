import {
  ArrowLeftRight,
  BadgeCheck,
  Calculator,
  Clock,
  Plus,
  ScanLine,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Agent = {
  name: string;
  role: string;
  icon: LucideIcon;
  active: boolean;
};

const AGENTS: Agent[] = [
  {
    name: 'Invoice Chaser',
    role: 'Chases overdue invoices',
    icon: Clock,
    active: true,
  },
  {
    name: 'Receipt Reader',
    role: 'Extracts data from receipts',
    icon: ScanLine,
    active: true,
  },
  {
    name: 'Reconciler',
    role: 'Matches bank transactions',
    icon: ArrowLeftRight,
    active: true,
  },
  {
    name: 'e-Invoice Submitter',
    role: 'Files to LHDN MyInvois',
    icon: BadgeCheck,
    active: true,
  },
  {
    name: 'Cashflow Forecaster',
    role: 'Projects your runway',
    icon: TrendingUp,
    active: false,
  },
  {
    name: 'Tax Estimator',
    role: 'Estimates SST & tax',
    icon: Calculator,
    active: false,
  },
];

export default function AgentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="AI Agents"
        subtitle="Your always-on finance crew."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Agent
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.name}
              className="space-y-3 rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    agent.active
                      ? 'bg-emerald-500/15 text-emerald-600'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {agent.active ? 'Active' : 'Paused'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{agent.name}</h3>
                <p className="text-sm text-muted-foreground">{agent.role}</p>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                <span>Last run · 2h ago</span>
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScreenContainer>
  );
}
