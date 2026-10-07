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

type Deal = {
  id: string;
  name: string;
  contact: string;
  value: number;
  lastTouch: string;
  tag?: string;
};

type Stage = {
  name: string;
  dot: string;
  deals: Deal[];
};

const STAGES: Stage[] = [
  {
    name: 'New Lead',
    dot: 'bg-primary',
    deals: [
      {
        id: 'd1',
        name: 'Aisyah Trading — Bulk order',
        contact: 'Aisyah Rahim',
        value: 12000,
        lastTouch: '3h ago',
        tag: 'Wholesale',
      },
      {
        id: 'd2',
        name: 'Faiz Studio — Branding',
        contact: 'Faiz Hakim',
        value: 5400,
        lastTouch: '1d ago',
      },
    ],
  },
  {
    name: 'Contacted',
    dot: 'bg-blue-500',
    deals: [
      {
        id: 'd3',
        name: 'Zaki Enterprise — Retainer',
        contact: 'Ahmad Zaki',
        value: 3500,
        lastTouch: '5h ago',
        tag: 'Recurring',
      },
      {
        id: 'd4',
        name: 'Nurul Boutique — POS setup',
        contact: 'Nurul Huda',
        value: 8900,
        lastTouch: '2d ago',
      },
    ],
  },
  {
    name: 'Qualified',
    dot: 'bg-violet-500',
    deals: [
      {
        id: 'd5',
        name: 'Ahmad F&B — Catering',
        contact: 'Ahmad Fauzi',
        value: 4200,
        lastTouch: '1d ago',
      },
      {
        id: 'd6',
        name: 'Lim Hardware — Fitout',
        contact: 'Lim Wei Jie',
        value: 15000,
        lastTouch: '4h ago',
        tag: 'High value',
      },
    ],
  },
  {
    name: 'Proposal Sent',
    dot: 'bg-amber-500',
    deals: [
      {
        id: 'd7',
        name: 'Siti Decor — Event',
        contact: 'Siti Aminah',
        value: 7200,
        lastTouch: '2d ago',
        tag: 'Follow up',
      },
    ],
  },
  {
    name: 'Won',
    dot: 'bg-emerald-500',
    deals: [
      {
        id: 'd8',
        name: 'Rahman Logistics — Annual',
        contact: 'Rahman Ali',
        value: 24000,
        lastTouch: '3d ago',
        tag: 'Annual',
      },
      {
        id: 'd9',
        name: 'Wong Cafe — Menu',
        contact: 'Wong Mei Ling',
        value: 1900,
        lastTouch: '1w ago',
      },
    ],
  },
];

const formatRM = (n: number) => `RM ${n.toLocaleString('en-MY')}`;

function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-3 shadow-sm">
      <p className="text-sm font-medium">{deal.name}</p>
      <div className="flex items-center gap-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
          {deal.contact.charAt(0)}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {deal.contact}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{formatRM(deal.value)}</span>
        {deal.tag ? (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {deal.tag}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        Last touch · {deal.lastTouch}
      </p>
    </div>
  );
}

export default function DealsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Deals"
        subtitle="Your sales pipeline — move deals toward close."
        actions={
          <>
            <Button variant="outline" size="sm">
              Daily Report
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              Add Deal
            </Button>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deals across all stages…"
            className="pl-9"
          />
        </div>
        <Select defaultValue="default">
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default pipeline</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const total = stage.deals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div
              key={stage.name}
              className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40 p-2"
            >
              <div className="mb-2 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${stage.dot}`} />
                  <span className="text-sm font-semibold">{stage.name}</span>
                  <span className="ml-auto rounded-full bg-background px-2 text-xs text-muted-foreground">
                    {stage.deals.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatRM(total)}
                </p>
              </div>
              <div className="space-y-2">
                {stage.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScreenContainer>
  );
}
