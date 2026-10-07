import { Plus, Search } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type JobStatus = 'Open' | 'Paused' | 'Closed';

type Job = {
  title: string;
  dept: string;
  location: string;
  status: JobStatus;
  applicants: number;
  open: string;
};

const JOBS: Job[] = [
  { title: 'Sales Executive', dept: 'Sales', location: 'KL', status: 'Open', applicants: 42, open: '12d' },
  { title: 'Graphic Designer', dept: 'Marketing', location: 'Remote', status: 'Open', applicants: 28, open: '8d' },
  { title: 'Ops Lead', dept: 'Operations', location: 'KL', status: 'Open', applicants: 15, open: '20d' },
  { title: 'Accountant', dept: 'Finance', location: 'KL', status: 'Paused', applicants: 9, open: '30d' },
  { title: 'Customer Support', dept: 'Operations', location: 'Penang', status: 'Open', applicants: 22, open: '5d' },
  { title: 'Content Writer', dept: 'Marketing', location: 'Remote', status: 'Closed', applicants: 12, open: '—' },
];

const PILL: Record<JobStatus, string> = {
  Open: 'bg-emerald-500/15 text-emerald-600',
  Paused: 'bg-amber-500/15 text-amber-600',
  Closed: 'bg-muted text-muted-foreground',
};

export default function JobsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Jobs"
        subtitle="Your open positions."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Post a Job
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs…" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {JOBS.map((job) => (
          <div
            key={job.title}
            className="space-y-3 rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{job.title}</h3>
              <span
                className={cn(
                  'inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                  PILL[job.status],
                )}
              >
                {job.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {job.dept} · {job.location}
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{job.applicants} applicants</span>
              <span>Open {job.open}</span>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View candidates
            </Button>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
