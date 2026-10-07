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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const ROWS: { name: string; hours: number[] }[] = [
  { name: 'Aisyah Rahim', hours: [8, 8, 7.5, 8, 8] },
  { name: 'Faiz Hakim', hours: [8, 8, 8, 8, 4] },
  { name: 'Ahmad Zaki', hours: [8.5, 8, 8, 8, 8] },
  { name: 'Nurul Huda', hours: [8, 8, 8, 8, 8] },
  { name: 'Lim Wei Jie', hours: [8, 0, 8, 8, 8] },
];

const fmt = (n: number) => n.toFixed(1);

export default function TimesheetScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Timesheet" subtitle="Team hours by day." />

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
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="whitespace-nowrap font-medium">{r.name}</TableCell>
                  {r.hours.map((h, i) => (
                    <TableCell key={DAYS[i]} className="tabular-nums">
                      {fmt(h)}
                    </TableCell>
                  ))}
                  <TableCell className="font-semibold tabular-nums">
                    {fmt(r.hours.reduce((a, b) => a + b, 0))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
