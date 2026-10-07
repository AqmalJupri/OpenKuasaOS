import { Search } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Candidate = {
  id: string;
  name: string;
  role: string;
  match: number;
  applied: string;
};

type Stage = {
  name: string;
  dot: string;
  candidates: Candidate[];
};

const STAGES: Stage[] = [
  {
    name: 'Applied',
    dot: 'bg-primary',
    candidates: [
      { id: 'c1', name: 'Aisyah Rahim', role: 'Sales Exec', match: 92, applied: '1d ago' },
      { id: 'c2', name: 'Faiz Hakim', role: 'Designer', match: 85, applied: '2d ago' },
      { id: 'c3', name: 'Ahmad Zaki', role: 'Ops Lead', match: 78, applied: '3d ago' },
    ],
  },
  {
    name: 'Screening',
    dot: 'bg-amber-500',
    candidates: [
      { id: 'c4', name: 'Nurul Huda', role: 'Accountant', match: 88, applied: '4d ago' },
      { id: 'c5', name: 'Siti Aminah', role: 'Support', match: 72, applied: '5d ago' },
    ],
  },
  {
    name: 'Interview',
    dot: 'bg-violet-500',
    candidates: [
      { id: 'c6', name: 'Lim Wei Jie', role: 'Ops Lead', match: 90, applied: '6d ago' },
      { id: 'c7', name: 'Tan Mei', role: 'Designer', match: 84, applied: '1w ago' },
    ],
  },
  {
    name: 'Offer',
    dot: 'bg-blue-500',
    candidates: [
      { id: 'c8', name: 'Rajesh K', role: 'Sales Exec', match: 95, applied: '1w ago' },
    ],
  },
  {
    name: 'Hired',
    dot: 'bg-emerald-500',
    candidates: [
      { id: 'c9', name: 'Wong Li', role: 'Support', match: 91, applied: '2w ago' },
      { id: 'c10', name: 'Chong A', role: 'Writer', match: 80, applied: '3w ago' },
    ],
  },
];

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
          {candidate.name.charAt(0)}
        </span>
        <span className="truncate text-sm font-medium">{candidate.name}</span>
      </div>
      <p className="text-xs text-muted-foreground">{candidate.role}</p>
      <p className="text-xs font-medium text-primary">
        Match {candidate.match}%
      </p>
      <p className="text-xs text-muted-foreground">
        Applied {candidate.applied}
      </p>
    </div>
  );
}

export default function CandidatesScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Candidates"
        subtitle="Move candidates through your hiring pipeline."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search candidates…" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All jobs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div
            key={stage.name}
            className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40 p-2"
          >
            <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
              <span className={`size-2 rounded-full ${stage.dot}`} />
              <span className="text-sm font-semibold">{stage.name}</span>
              <span className="ml-auto rounded-full bg-background px-2 text-xs text-muted-foreground">
                {stage.candidates.length}
              </span>
            </div>
            <div className="space-y-2">
              {stage.candidates.map((c) => (
                <CandidateCard key={c.id} candidate={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
