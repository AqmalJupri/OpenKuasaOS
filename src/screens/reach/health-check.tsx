import { AlertTriangle, CircleCheck, XCircle } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { cn } from '@/lib/utils';

type Status = 'Healthy' | 'Warning' | 'Action needed';

type Check = {
  name: string;
  description: string;
  status: Status;
};

const CHECKS: Check[] = [
  {
    name: 'Meta account connected',
    description: 'Link your Meta Business account',
    status: 'Action needed',
  },
  {
    name: 'Facebook Page linked',
    description: 'Select the Page to run ads from',
    status: 'Action needed',
  },
  {
    name: 'Lead forms configured',
    description: 'At least one active lead form',
    status: 'Warning',
  },
  {
    name: 'WhatsApp number verified',
    description: 'For auto follow-ups',
    status: 'Healthy',
  },
  {
    name: 'Billing method on file',
    description: 'Meta bills your card directly',
    status: 'Healthy',
  },
  {
    name: 'Conversions API / Pixel',
    description: 'Improves tracking accuracy',
    status: 'Warning',
  },
  {
    name: 'Domain verified',
    description: 'Required for some objectives',
    status: 'Healthy',
  },
];

const STATUS_PILL: Record<Status, string> = {
  Healthy: 'bg-emerald-500/15 text-emerald-600',
  Warning: 'bg-amber-500/15 text-amber-600',
  'Action needed': 'bg-red-500/15 text-red-600',
};

function StatusIcon({ status }: { status: Status }) {
  if (status === 'Healthy') {
    return <CircleCheck className="size-5 shrink-0 text-emerald-600" />;
  }
  if (status === 'Warning') {
    return <AlertTriangle className="size-5 shrink-0 text-amber-600" />;
  }
  return <XCircle className="size-5 shrink-0 text-red-600" />;
}

export default function HealthCheckScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Health Check"
        subtitle="System status and setup checklist for your ad engine."
      />
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <AlertTriangle className="size-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold">2 issues need attention</p>
          <p className="text-sm text-muted-foreground">
            Resolve the items below to start running ads.
          </p>
        </div>
      </div>
      <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
        {CHECKS.map((check) => (
          <div
            key={check.name}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <StatusIcon status={check.status} />
              <div className="min-w-0">
                <p className="font-medium">{check.name}</p>
                <p className="text-sm text-muted-foreground">{check.description}</p>
              </div>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                STATUS_PILL[check.status],
              )}
            >
              {check.status}
            </span>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
