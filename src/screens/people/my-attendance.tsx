import { CheckCircle2, Clock, Timer, XCircle } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'Present' | 'Late' | 'Absent';

type AttendanceRow = {
  date: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: AttendanceStatus;
};

const HISTORY: AttendanceRow[] = [
  { date: '06 Oct 2026', clockIn: '09:02', clockOut: '18:10', hours: '8.1', status: 'Present' },
  { date: '05 Oct 2026', clockIn: '08:55', clockOut: '18:00', hours: '8.1', status: 'Present' },
  { date: '03 Oct 2026', clockIn: '09:20', clockOut: '18:00', hours: '7.6', status: 'Late' },
  { date: '02 Oct 2026', clockIn: '09:00', clockOut: '18:05', hours: '8.1', status: 'Present' },
  { date: '01 Oct 2026', clockIn: '—', clockOut: '—', hours: '0.0', status: 'Absent' },
  { date: '30 Sep 2026', clockIn: '08:58', clockOut: '18:02', hours: '8.1', status: 'Present' },
];

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-500/15 text-emerald-600',
  Late: 'bg-amber-500/15 text-amber-600',
  Absent: 'bg-red-500/15 text-red-600',
};

export default function MyAttendanceScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="My Attendance"
        subtitle="Clock in, track hours, and review history."
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-3xl font-bold tracking-tight">7:53 PM</p>
            <p className="text-sm text-muted-foreground">
              Wednesday, 07 Oct 2026 · Shift unavailable
            </p>
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <Button size="lg">Clock In</Button>
            <p className="text-xs text-muted-foreground">
              Location captured on clock-in
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Present" value={18} icon={CheckCircle2} tone="green" />
        <StatCard label="Late" value={1} icon={Clock} tone="amber" />
        <StatCard label="Absent" value={0} icon={XCircle} tone="primary" />
        <StatCard
          label="Hours"
          value="142.5"
          note="of 176h"
          icon={Timer}
          tone="primary"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold tracking-tight">Attendance history</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HISTORY.map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {r.date}
                  </TableCell>
                  <TableCell className="tabular-nums">{r.clockIn}</TableCell>
                  <TableCell className="tabular-nums">{r.clockOut}</TableCell>
                  <TableCell className="tabular-nums">{r.hours}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        STATUS_STYLES[r.status],
                      )}
                    >
                      {r.status}
                    </span>
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
