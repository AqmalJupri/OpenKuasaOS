import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Rating = 'Exceeds' | 'Meets' | 'Below';

type Review = {
  name: string;
  cycle: string;
  manager: string;
  self: string;
  final: string;
  rating: Rating;
  status: 'Completed' | 'In review';
};

const REVIEWS: Review[] = [
  { name: 'Aisyah Rahim', cycle: 'H2 2026', manager: '4.4', self: '4.2', final: '4.3', rating: 'Exceeds', status: 'Completed' },
  { name: 'Ahmad Zaki', cycle: 'H2 2026', manager: '4.0', self: '4.1', final: '4.0', rating: 'Meets', status: 'Completed' },
  { name: 'Faiz Hakim', cycle: 'H2 2026', manager: '3.6', self: '3.8', final: '3.7', rating: 'Meets', status: 'Completed' },
  { name: 'Nurul Huda', cycle: 'H2 2026', manager: '4.6', self: '4.3', final: '4.5', rating: 'Exceeds', status: 'Completed' },
  { name: 'Siti Aminah', cycle: 'H2 2026', manager: '3.1', self: '3.4', final: '3.2', rating: 'Below', status: 'In review' },
  { name: 'Lim Wei Jie', cycle: 'H2 2026', manager: '3.9', self: '3.7', final: '3.8', rating: 'Meets', status: 'Completed' },
];

const RATING_STYLES: Record<Rating, string> = {
  Exceeds: 'bg-emerald-500/15 text-emerald-600',
  Meets: 'bg-amber-500/15 text-amber-600',
  Below: 'bg-red-500/15 text-red-600',
};

export default function ReviewScoresScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Review Scores"
        subtitle="Performance review results · H2 2026."
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Self</TableHead>
                <TableHead>Final</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REVIEWS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="whitespace-nowrap font-medium">{r.name}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{r.cycle}</TableCell>
                  <TableCell className="tabular-nums">{r.manager}</TableCell>
                  <TableCell className="tabular-nums">{r.self}</TableCell>
                  <TableCell className="font-semibold tabular-nums">{r.final}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        RATING_STYLES[r.rating],
                      )}
                    >
                      {r.rating}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
