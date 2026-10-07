import {
  AlertCircle,
  CalendarClock,
  FileText,
  MessageSquare,
  Plus,
  ShieldAlert,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Agent = {
  name: string;
  role: string;
  description: string;
  icon: LucideIcon;
  active: boolean;
};

const AGENTS: Agent[] = [
  {
    name: 'Lead Scorer',
    role: 'Scores & prioritises leads',
    description: 'Ranks every lead by buying intent so you call the best first.',
    icon: Target,
    active: true,
  },
  {
    name: 'Follow-up Writer',
    role: 'Drafts WhatsApp & email follow-ups',
    description: 'Writes warm, on-brand replies for deals that went quiet.',
    icon: MessageSquare,
    active: true,
  },
  {
    name: 'Pipeline Nudger',
    role: 'Flags stalled deals',
    description: 'Alerts you when a deal sits too long in one stage.',
    icon: AlertCircle,
    active: true,
  },
  {
    name: 'Meeting Booker',
    role: 'Schedules from replies',
    description: 'Reads customer replies and books meetings straight into your calendar.',
    icon: CalendarClock,
    active: true,
  },
  {
    name: 'Churn Watcher',
    role: 'Spots at-risk customers',
    description: 'Watches engagement dips and warns you before customers leave.',
    icon: ShieldAlert,
    active: false,
  },
  {
    name: 'Quote Builder',
    role: 'Drafts quotations',
    description: 'Turns a deal into a ready-to-send quotation in RM.',
    icon: FileText,
    active: false,
  },
];

export default function AgentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="AI Agents"
        subtitle="Your always-on sales crew."
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
              <p className="text-sm text-muted-foreground">
                {agent.description}
              </p>
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
