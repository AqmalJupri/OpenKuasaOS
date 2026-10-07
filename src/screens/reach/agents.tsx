import {
  FileBarChart,
  FlaskConical,
  MessageSquare,
  Plus,
  Target,
  TrendingUp,
  Users,
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
    name: 'Lead Qualifier',
    role: 'Scores & routes inbound leads',
    description: 'Ranks every new enquiry and sends hot leads to Aisyah first.',
    icon: Target,
    active: true,
  },
  {
    name: 'Ad Optimizer',
    role: 'Shifts budget to winning ads',
    description: 'Moves daily spend from weak ads to top performers in RM.',
    icon: TrendingUp,
    active: true,
  },
  {
    name: 'Follow-up Writer',
    role: 'Drafts WhatsApp follow-ups',
    description: 'Writes warm, on-brand replies for leads that went quiet.',
    icon: MessageSquare,
    active: true,
  },
  {
    name: 'Audience Finder',
    role: 'Builds lookalike audiences',
    description: 'Finds new buyers who look like your best repeat customers.',
    icon: Users,
    active: false,
  },
  {
    name: 'Creative Tester',
    role: 'A/B tests ad creatives',
    description: 'Runs headline and image variants and keeps the winner.',
    icon: FlaskConical,
    active: true,
  },
  {
    name: 'Report Builder',
    role: 'Weekly performance digest',
    description: 'Sends Faiz a clear weekly summary of spend, leads and ROI.',
    icon: FileBarChart,
    active: false,
  },
];

export default function AgentsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="AI Agents"
        subtitle="Your always-on marketing crew."
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
