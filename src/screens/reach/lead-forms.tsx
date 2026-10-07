import {
  CalendarDays,
  FileText,
  FolderOpen,
  History,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { EmptyState } from '@/components/screen/empty-state';
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const COLUMNS = [
  'Form Details',
  'URL / Slug',
  'Status',
  'Views',
  'Contacts',
  'Created At',
  'Action',
];

export default function LeadFormsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Lead Forms"
        subtitle="Manage all your lead-generation forms."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Create New Form
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search form title…" className="pl-9" />
        </div>
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
        <StatCard label="Total Forms" value={0} icon={FileText} tone="primary" />
        <StatCard
          label="Total Leads"
          value={0}
          note="Active form leads"
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="New Lead Yesterday"
          value={0}
          icon={History}
          tone="amber"
        />
        <StatCard
          label="Today New Leads"
          value={0}
          icon={CalendarDays}
          tone="green"
        />
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
          </Table>
        </div>
        <EmptyState
          icon={FolderOpen}
          title="No lead forms found."
          description="Create your first form to start capturing leads."
        />
      </div>
    </ScreenContainer>
  );
}
