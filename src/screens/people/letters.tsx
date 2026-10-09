import {
  Download,
  Eye,
  FileText,
  LayoutTemplate,
  PieChart,
  Plus,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
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

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

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
  { id: '1', letter: 'Offer Letter', employee: 'Hafiz Omar', type: 'Offer', date: '06 Oct', status: 'Draft' },
  { id: '2', letter: 'Offer Letter', employee: 'Aisyah Rahim', type: 'Offer', date: '01 Oct', status: 'Issued' },
  { id: '3', letter: 'Confirmation Letter', employee: 'Faiz Hakim', type: 'Confirmation', date: '28 Sep', status: 'Issued' },
  { id: '4', letter: 'Warning Letter (Surat Amaran)', employee: 'Confidential', type: 'Warning', date: '20 Sep', status: 'Draft' },
  { id: '5', letter: 'Reference Letter', employee: 'Nurul Huda', type: 'Reference', date: '15 Sep', status: 'Issued' },
  { id: '6', letter: 'EA Form (CP8A)', employee: 'Ahmad Zaki', type: 'EA', date: '12 Sep', status: 'Issued' },
  { id: '7', letter: 'EA Form (CP8A)', employee: 'Lim Wei Jie', type: 'EA', date: '11 Sep', status: 'Issued' },
  { id: '8', letter: 'Salary Adjustment', employee: 'Siti Aminah', type: 'Adjustment', date: '10 Sep', status: 'Draft' },
];

const STATUS_STYLE: Record<LetterStatus, string> = {
  Issued: 'bg-emerald-500/15 text-emerald-600',
  Draft: 'bg-amber-500/15 text-amber-600',
};

/* Letters issued by type (YTD) — sums to 96 */
const BY_TYPE: Slice[] = [
  { key: 'ea', label: 'EA form', value: 42, color: 'var(--chart-1)' },
  { key: 'offer', label: 'Offer', value: 24, color: 'var(--chart-2)' },
  { key: 'confirmation', label: 'Confirmation', value: 18, color: 'var(--chart-3)' },
  { key: 'reference', label: 'Reference', value: 9, color: 'var(--chart-5)' },
  { key: 'warning', label: 'Warning', value: 3, color: 'var(--chart-4)' },
];

type Template = { name: string; used: number; active: boolean };

const TEMPLATES: Template[] = [
  { name: 'EA Form (CP8A)', used: 42, active: true },
  { name: 'Offer Letter', used: 24, active: true },
  { name: 'Confirmation Letter', used: 18, active: true },
  { name: 'Reference Letter', used: 9, active: true },
  { name: 'Salary Adjustment', used: 6, active: false },
  { name: 'Warning Letter', used: 3, active: true },
];

/* ------------------------------------------------------------------ */

export default function LettersScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="HR Letters"
        subtitle="Generate and manage employee letters, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Generate Letter
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat label="Issued" value="96" delta="YTD" deltaTone="flat" onPrimary />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Drafts" value="5" delta="in progress" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Templates" value="8" delta="active" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Issued this month" value="8" delta="+3" deltaTone="up" />
        </BentoCard>

        {/* By type + templates */}
        <BentoCard
          title="Letters by type"
          subtitle="Issued YTD"
          icon={PieChart}
          className="col-span-2 md:col-span-5"
        >
          <DonutStat data={BY_TYPE} height={240} centerValue="96" centerLabel="issued" />
        </BentoCard>
        <BentoCard
          title="Letter templates"
          subtitle="Most used"
          icon={LayoutTemplate}
          className="col-span-2 md:col-span-7"
        >
          <ul className="divide-y">
            {TEMPLATES.map((t) => (
              <li key={t.name} className="flex items-center gap-3 py-2.5">
                <LiveDot active={t.active} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {t.name}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  used {t.used}×
                </span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Letters table */}
        <BentoCard
          title="Recent letters"
          subtitle="Pulsing dot marks drafts in progress"
          icon={FileText}
          flush
          className="col-span-2 md:col-span-12"
        >
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
                      <span className="flex items-center gap-2">
                        <LiveDot active={l.status === 'Draft'} />
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            STATUS_STYLE[l.status],
                          )}
                        >
                          {l.status}
                        </span>
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
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
