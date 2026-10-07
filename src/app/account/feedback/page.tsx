import { ChevronUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const REQUESTS = [
  { title: 'Bulk WhatsApp templates', desc: 'Save and reuse message templates for broadcasts', votes: 128, status: 'Planned' },
  { title: 'Xero / QuickBooks sync', desc: 'Two-way sync with popular accounting tools', votes: 94, status: 'Under review' },
  { title: 'Mobile app for approvals', desc: 'Approve leave & claims on the go', votes: 76, status: 'In progress' },
  { title: 'Custom deal stages', desc: 'Rename and reorder pipeline stages per workspace', votes: 61, status: 'Planned' },
  { title: 'Dark mode', desc: 'A full dark theme across the app', votes: 48, status: 'Under review' },
];

const STATUS_STYLES: Record<string, string> = {
  Planned: 'bg-blue-500/15 text-blue-600',
  'In progress': 'bg-emerald-500/15 text-emerald-600',
  'Under review': 'bg-amber-500/15 text-amber-600',
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Requests</h1>
          <p className="text-sm text-muted-foreground">
            Vote on ideas or suggest your own.
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4" />
          Submit idea
        </Button>
      </div>

      <div className="space-y-3">
        {REQUESTS.map((r) => (
          <div
            key={r.title}
            className="flex items-start gap-4 rounded-xl border bg-card p-4 shadow-sm"
          >
            <button
              type="button"
              className="flex w-14 shrink-0 flex-col items-center rounded-lg border py-1.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronUp className="size-4" />
              {r.votes}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{r.title}</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
