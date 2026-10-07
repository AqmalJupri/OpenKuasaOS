import { MapPin, Plus, Search } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
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

type Candidate = {
  name: string;
  title: string;
  skills: string[];
  location: string;
};

const CANDIDATES: Candidate[] = [
  { name: 'Nur Aisyah Rahman', title: 'Senior Designer', skills: ['Figma', 'UI/UX', 'Branding'], location: 'Kuala Lumpur' },
  { name: 'Muhammad Hafiz', title: 'Sales Executive', skills: ['B2B Sales', 'CRM'], location: 'Petaling Jaya' },
  { name: 'Lim Wei Jie', title: 'Full-Stack Developer', skills: ['React', 'Node.js', 'PostgreSQL'], location: 'Penang' },
  { name: 'Siti Nurhaliza Ahmad', title: 'Senior Accountant', skills: ['SQL Accounting', 'Tax'], location: 'Shah Alam' },
  { name: 'Kavitha Subramaniam', title: 'Digital Marketer', skills: ['SEO', 'Meta Ads', 'Analytics'], location: 'Johor Bahru' },
  { name: 'Azrul Hakim', title: 'Operations Executive', skills: ['Logistics', 'Excel', 'Vendor Mgmt'], location: 'Klang' },
  { name: 'Farah Diyana', title: 'Content Writer', skills: ['Copywriting', 'Bahasa Malaysia'], location: 'Cyberjaya' },
  { name: 'Tan Mei Ling', title: 'Customer Support Lead', skills: ['Zendesk', 'Mandarin', 'Escalations'], location: 'Ipoh' },
  { name: 'Danial Iskandar', title: 'Data Analyst', skills: ['Python', 'Power BI', 'SQL'], location: 'Kuching' },
];

export default function TalentPoolScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Talent Pool"
        subtitle="Saved candidates for future roles."
        actions={
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            Add to Pool
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or skill…" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CANDIDATES.map((c) => (
          <div key={c.name} className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="truncate text-sm text-muted-foreground">{c.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="size-3.5" />
                {c.location}
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-600">
                Available
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Move to pipeline
            </Button>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
