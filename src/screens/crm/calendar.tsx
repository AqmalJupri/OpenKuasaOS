import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LEADING_EMPTY = 4; // Oct 1, 2026 is a Thursday
const DAYS_IN_MONTH = 31;
const TODAY = 7;

const EVENTS: Record<number, { label: string; className: string }> = {
  7: { label: 'Demo · Aisyah', className: 'bg-primary/10 text-primary' },
  9: {
    label: 'Follow-up · Zaki',
    className: 'bg-blue-500/10 text-blue-600',
  },
  14: { label: 'Team sync', className: 'bg-violet-500/10 text-violet-600' },
  21: {
    label: 'Proposal review',
    className: 'bg-amber-500/10 text-amber-600',
  },
  28: { label: 'Catering call', className: 'bg-primary/10 text-primary' },
};

export default function CalendarScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Calendar"
        subtitle="Appointments, follow-ups & team events."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Event
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">October 2026</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Next month">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px] rounded-xl border bg-card p-3 shadow-sm">
          <div className="grid grid-cols-7">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="pb-2 text-center text-xs font-medium text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: LEADING_EMPTY }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
              const day = i + 1;
              const event = EVENTS[day];
              return (
                <div
                  key={day}
                  className={cn(
                    'min-h-24 min-w-0 rounded-md border p-1.5',
                    day === TODAY && 'bg-primary/5 ring-1 ring-primary',
                  )}
                >
                  <div className="mb-1 text-xs text-muted-foreground">
                    {day}
                  </div>
                  {event ? (
                    <div
                      className={cn(
                        'truncate rounded px-1.5 py-0.5 text-[10px] font-medium',
                        event.className,
                      )}
                    >
                      {event.label}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
