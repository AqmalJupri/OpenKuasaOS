import {
  CircleCheck,
  CircleX,
  Copy,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  'Page',
  'Type',
  'URL / Slug',
  'Status',
  'Views',
  'Created',
  'Action',
];

type PageRow = {
  title: string;
  type: string;
  slug: string;
  status: 'Active' | 'Inactive';
  views: number;
  created: string;
};

const PAGES: PageRow[] = [
  {
    title: 'Raya Mega Sale',
    type: 'AI Page',
    slug: '/raya-sale',
    status: 'Active',
    views: 642,
    created: '07 Oct 2026',
  },
  {
    title: 'Product Launch — Series X',
    type: 'AI Page',
    slug: '/series-x',
    status: 'Active',
    views: 418,
    created: '02 Oct 2026',
  },
  {
    title: 'Webinar Signup',
    type: 'Landing',
    slug: '/webinar',
    status: 'Inactive',
    views: 144,
    created: '28 Sep 2026',
  },
];

function StatusPill({ status }: { status: PageRow['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        status === 'Active'
          ? 'bg-emerald-500/15 text-emerald-600'
          : 'bg-amber-500/15 text-amber-600',
      )}
    >
      {status}
    </span>
  );
}

export default function LandingPageScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Landing Pages"
        badge={
          <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600">
            BETA
          </span>
        }
        subtitle="Build and manage AI-generated landing pages."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Create New Page
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search page title…" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pages" value={3} icon={FileText} tone="primary" />
        <StatCard
          label="Current Active"
          value={2}
          icon={CircleCheck}
          tone="green"
        />
        <StatCard label="Inactive" value={1} icon={CircleX} tone="amber" />
        <StatCard label="Total Views" value="1,204" icon={Eye} tone="blue" />
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
              {PAGES.map((p) => (
                <TableRow key={p.slug}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {p.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.type}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {p.slug}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={p.status} />
                  </TableCell>
                  <TableCell>{p.views}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {p.created}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Copy">
                        <Copy className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete">
                        <Trash2 className="size-4" />
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
