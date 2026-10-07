import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Shift = 'M' | 'N' | 'O';

const SHIFTS: Record<Shift, { label: string; className: string }> = {
  M: { label: 'Morning (9–5)', className: 'bg-primary/10 text-primary' },
  N: { label: 'Night (10–6)', className: 'bg-violet-500/10 text-violet-600' },
  O: { label: 'Off', className: 'bg-muted text-muted-foreground' },
};

const ROWS: { name: string; shifts: Shift[] }[] = [
  { name: 'Aisyah Rahim', shifts: ['M', 'M', 'M', 'M', 'M', 'O', 'O'] },
  { name: 'Faiz Hakim', shifts: ['M', 'M', 'O', 'M', 'M', 'M', 'O'] },
  { name: 'Ahmad Zaki', shifts: ['N', 'N', 'N', 'O', 'N', 'N', 'O'] },
  { name: 'Nurul Huda', shifts: ['M', 'O', 'M', 'M', 'M', 'O', 'M'] },
  { name: 'Lim Wei Jie', shifts: ['O', 'N', 'N', 'N', 'O', 'M', 'M'] },
];

export default function ShiftCalendarScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Shift Calendar" subtitle="Weekly shift schedule." />

      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold">Week of 05–11 Oct 2026</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Previous week">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Next week">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                {DAYS.map((d) => (
                  <TableHead key={d}>{d}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="whitespace-nowrap font-medium">{r.name}</TableCell>
                  {r.shifts.map((s, i) => (
                    <TableCell key={DAYS[i]}>
                      <span
                        className={cn(
                          'inline-flex whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium',
                          SHIFTS[s].className,
                        )}
                      >
                        {SHIFTS[s].label}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
