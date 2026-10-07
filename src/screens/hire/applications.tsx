import { CircleDot, ListChecks, Star, UserX } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const COLUMNS = ['Candidate', 'Job', 'Applied', 'Source', 'Stage', 'Status'];

type Status = 'Shortlisted' | 'Screening' | 'New' | 'Rejected';

const STATUS_STYLES: Record<Status, string> = {
  Shortlisted: 'bg-emerald-500/15 text-emerald-600',
  Screening: 'bg-amber-500/15 text-amber-600',
  New: 'bg-amber-500/15 text-amber-600',
  Rejected: 'bg-muted text-muted-foreground',
};

const ROWS: {
  name: string;
  job: string;
  applied: string;
  source: string;
  stage: string;
  status: Status;
}[] = [
  { name: 'Aisyah Rahim', job: 'Sales Executive', applied: '06 Oct 2026', source: 'Careers Page', stage: 'Applied', status: 'New' },
  { name: 'Faiz Hakim', job: 'Product Designer', applied: '05 Oct 2026', source: 'LinkedIn', stage: 'Applied', status: 'New' },
  { name: 'Nurul Huda', job: 'Accountant', applied: '03 Oct 2026', source: 'Job Board', stage: 'Screening', status: 'Screening' },
  { name: 'Lim Wei Jie', job: 'Operations Lead', applied: '01 Oct 2026', source: 'Referral', stage: 'Interview', status: 'Shortlisted' },
  { name: 'Siti Aminah', job: 'Customer Support', applied: '02 Oct 2026', source: 'Careers Page', stage: 'Screening', status: 'Screening' },
  { name: 'Rajesh K', job: 'Sales Executive', applied: '28 Sep 2026', source: 'LinkedIn', stage: 'Offer', status: 'Shortlisted' },
  { name: 'Ahmad Zaki', job: 'Operations Lead', applied: '04 Oct 2026', source: 'Job Board', stage: 'Applied', status: 'Rejected' },
  { name: 'Tan Mei', job: 'Product Designer', applied: '30 Sep 2026', source: 'Referral', stage: 'Interview', status: 'Shortlisted' },
];

export default function ApplicationsScreen() {
  return (
    <ScreenContainer>
      <PageHeader title="Applications" subtitle="All incoming applications." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New" value="24" icon={CircleDot} tone="primary" />
        <StatCard label="Screening" value="42" icon={ListChecks} tone="blue" />
        <StatCard label="Shortlisted" value="18" icon={Star} tone="amber" />
        <StatCard label="Rejected" value="44" icon={UserX} tone="violet" />
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
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {r.applied}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.source}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.stage}</TableCell>
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
