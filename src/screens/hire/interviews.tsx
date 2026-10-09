import { CalendarCheck, CalendarClock, CalendarDays, Plus, UserX } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Badge } from '@/components/ui/badge';
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

const COLUMNS = [
  'Candidate',
  'Job',
  'Date',
  'Time',
  'Interviewer',
  'Type',
  'Status',
];

type Status = 'Scheduled' | 'Completed';

const STATUS_STYLES: Record<Status, string> = {
  Scheduled: 'bg-emerald-500/15 text-emerald-600',
  Completed: 'bg-muted text-muted-foreground',
};

const ROWS: {
  name: string;
  job: string;
  date: string;
  time: string;
  interviewer: string;
  type: 'Video' | 'Phone' | 'Onsite';
  status: Status;
}[] = [
  { name: 'Lim Wei Jie', job: 'Operations Lead', date: '08 Oct', time: '10:00', interviewer: 'Ahmad Zaki', type: 'Onsite', status: 'Scheduled' },
  { name: 'Tan Mei', job: 'Product Designer', date: '08 Oct', time: '14:00', interviewer: 'Faiz Hakim', type: 'Video', status: 'Scheduled' },
  { name: 'Nurul Huda', job: 'Accountant', date: '09 Oct', time: '11:30', interviewer: 'Siti Aminah', type: 'Phone', status: 'Scheduled' },
  { name: 'Rajesh K', job: 'Sales Executive', date: '07 Oct', time: '11:00', interviewer: 'Saudara', type: 'Video', status: 'Completed' },
  { name: 'Wong Li', job: 'Customer Support', date: '06 Oct', time: '15:00', interviewer: 'Aisyah Rahim', type: 'Onsite', status: 'Completed' },
  { name: 'Chong A', job: 'Content Writer', date: '06 Oct', time: '09:30', interviewer: 'Faiz Hakim', type: 'Phone', status: 'Completed' },
];

export default function InterviewsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Interviews"
        subtitle="Scheduled interviews."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Schedule Interview
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="This Week" value="9" icon={CalendarDays} tone="primary" />
        <StatCard label="Completed" value="4" icon={CalendarCheck} tone="green" />
        <StatCard label="Upcoming" value="5" icon={CalendarClock} tone="amber" />
        <StatCard label="No-shows" value="0" icon={UserX} tone="violet" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                {COLUMNS.map((c) => (
                  <TableHead key={c} className="whitespace-nowrap">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {r.name.charAt(0)}
                      </span>
                      <span className="whitespace-nowrap font-medium">
                        {r.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.job}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.time}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.interviewer}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
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
