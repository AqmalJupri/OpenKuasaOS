import { Download, Eye, Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
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

type LetterStatus = 'Issued' | 'Draft';

type Letter = {
  id: string;
  letter: string;
  employee: string;
  type: string;
  date: string;
  status: LetterStatus;
};

const LETTERS: Letter[] = [
  { id: '1', letter: 'Offer Letter', employee: 'Aisyah Rahim', type: 'Offer', date: '01 Oct', status: 'Issued' },
  { id: '2', letter: 'Confirmation Letter', employee: 'Faiz Hakim', type: 'Confirmation', date: '28 Sep', status: 'Issued' },
  { id: '3', letter: 'Warning Letter', employee: 'Staff X', type: 'Warning', date: '20 Sep', status: 'Draft' },
  { id: '4', letter: 'Reference Letter', employee: 'Nurul Huda', type: 'Reference', date: '15 Sep', status: 'Issued' },
  { id: '5', letter: 'Salary Adjustment', employee: 'Ahmad Zaki', type: 'Adjustment', date: '10 Sep', status: 'Draft' },
];

const STATUS_STYLE: Record<LetterStatus, string> = {
  Issued: 'bg-emerald-500/15 text-emerald-600',
  Draft: 'bg-amber-500/15 text-amber-600',
};

export default function LettersScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="HR Letters"
        subtitle="Generate and manage employee letters."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Generate Letter
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Letter</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LETTERS.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {l.letter}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {l.employee.charAt(0)}
                      </span>
                      <span className="whitespace-nowrap">{l.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{l.type}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {l.date}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        STATUS_STYLE[l.status],
                      )}
                    >
                      {l.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" aria-label="View letter">
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Download letter">
                        <Download className="size-4" />
                      </Button>
                    </div>
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
