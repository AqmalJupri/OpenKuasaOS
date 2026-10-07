import { GraduationCap, Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Training = {
  title: string;
  desc: string;
  status: 'Upcoming' | 'Completed';
  date: string;
  attendees: number;
};

const TRAININGS: Training[] = [
  { title: 'Sales Bootcamp', desc: 'Pipeline, objection handling and closing techniques.', status: 'Upcoming', date: '12 Oct', attendees: 8 },
  { title: 'Fire Safety Drill', desc: 'Evacuation routes and extinguisher handling.', status: 'Upcoming', date: '18 Oct', attendees: 24 },
  { title: 'Excel for Finance', desc: 'Formulas, pivots and reconciliations for the finance team.', status: 'Completed', date: '28 Sep', attendees: 6 },
  { title: 'Leadership 101', desc: 'Foundations of coaching and managing small teams.', status: 'Upcoming', date: '25 Oct', attendees: 5 },
  { title: 'Customer Service Essentials', desc: 'Handling enquiries and complaints with confidence.', status: 'Completed', date: '20 Sep', attendees: 12 },
  { title: 'LHDN e-Invois Training', desc: 'Issuing and managing e-Invoices under LHDN rules.', status: 'Completed', date: '15 Sep', attendees: 9 },
];

export default function TrainingScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Training"
        subtitle="Courses and sessions for your team."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            New Training
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRAININGS.map((t) => (
          <div key={t.title} className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </div>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  t.status === 'Completed'
                    ? 'bg-emerald-500/15 text-emerald-600'
                    : 'bg-amber-500/15 text-amber-600',
                )}
              >
                {t.status}
              </span>
            </div>
            <p className="font-semibold">{t.title}</p>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t.date}</span>
              <span>{t.attendees} attendees</span>
            </div>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
