import { Eye, FileText, TrendingUp } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Job = {
  title: string;
  applicants: number;
  views: number;
  status: 'Active' | 'Closed';
};

const JOBS: Job[] = [
  { title: 'Senior Product Designer', applicants: 34, views: 1120, status: 'Active' },
  { title: 'Sales Executive', applicants: 27, views: 860, status: 'Active' },
  { title: 'Full-Stack Developer', applicants: 41, views: 1350, status: 'Active' },
  { title: 'Finance Executive', applicants: 16, views: 540, status: 'Active' },
  { title: 'Customer Support Officer', applicants: 10, views: 410, status: 'Closed' },
];

export default function CareersPageScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Careers Page"
        subtitle="Your public job board."
        actions={
          <>
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button size="sm">Publish</Button>
          </>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your careers page</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="break-all font-mono font-medium">careers.openkuasa.com</p>
              <p className="text-sm text-muted-foreground">
                Published · last updated 2 days ago
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                Active
              </span>
              <Button variant="outline" size="sm">
                Copy link
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Page Views" value="4,280" icon={Eye} tone="primary" />
          <StatCard label="Applications" value="128" icon={FileText} tone="blue" />
          <StatCard label="Conversion" value="3.0%" icon={TrendingUp} tone="amber" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Published jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="whitespace-nowrap">Job</TableHead>
                    <TableHead className="whitespace-nowrap">Applicants</TableHead>
                    <TableHead className="whitespace-nowrap">Views</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {JOBS.map((j) => (
                    <TableRow key={j.title}>
                      <TableCell className="whitespace-nowrap font-medium">{j.title}</TableCell>
                      <TableCell>{j.applicants}</TableCell>
                      <TableCell>{j.views.toLocaleString('en-US')}</TableCell>
                      <TableCell>
                        <span
                          className={
                            j.status === 'Active'
                              ? 'rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600'
                              : 'rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                          }
                        >
                          {j.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Customise how your careers page looks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" defaultValue="Join our team" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-colour">Primary colour</Label>
              <Input id="primary-colour" defaultValue="#2E8B57" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" defaultValue="Build the future with us" />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScreenContainer>
  );
}
