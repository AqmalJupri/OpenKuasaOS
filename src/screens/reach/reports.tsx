import { Coins, Download, Percent, TrendingDown, Users } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { StatCard } from '@/components/screen/stat-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

type Bar = { label: string; pct: number; muted?: boolean };

const LEADS_OVER_TIME: Bar[] = [
  { label: 'Mon', pct: 40 },
  { label: 'Tue', pct: 55, muted: true },
  { label: 'Wed', pct: 45 },
  { label: 'Thu', pct: 70, muted: true },
  { label: 'Fri', pct: 60 },
  { label: 'Sat', pct: 85 },
  { label: 'Sun', pct: 75, muted: true },
];

const SPEND_BY_CHANNEL: Bar[] = [
  { label: 'WhatsApp', pct: 80 },
  { label: 'Facebook', pct: 65, muted: true },
  { label: 'Instagram', pct: 50 },
  { label: 'TikTok', pct: 30, muted: true },
];

type Campaign = {
  name: string;
  leads: number;
  spend: string;
  cpl: string;
  conv: string;
};

const CAMPAIGNS: Campaign[] = [
  { name: 'Ramadan–Raya Promo', leads: 96, spend: 'RM 1,200', cpl: 'RM 12.50', conv: '5.2%' },
  { name: 'Retargeting — Cart', leads: 54, spend: 'RM 640', cpl: 'RM 11.85', conv: '6.1%' },
  { name: 'New Product Launch', leads: 70, spend: 'RM 1,850', cpl: 'RM 26.40', conv: '3.4%' },
  { name: 'Lead Magnet — eBook', leads: 61, spend: 'RM 420', cpl: 'RM 6.88', conv: '7.0%' },
  { name: 'Brand Awareness', leads: 18, spend: 'RM 900', cpl: 'RM 50.00', conv: '1.1%' },
];

function BarChart({ bars }: { bars: Bar[] }) {
  return (
    <div>
      <div className="flex h-40 items-end gap-2">
        {bars.map((bar) => (
          <div
            key={bar.label}
            className={
              bar.muted
                ? 'flex-1 rounded-t-md bg-primary/50'
                : 'flex-1 rounded-t-md bg-primary'
            }
            style={{ height: `${bar.pct}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
        {bars.map((bar) => (
          <span key={bar.label} className="min-w-0 flex-1 truncate text-center">
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ReportsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Reports"
        subtitle="Ad performance and lead analytics."
        actions={
          <>
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={342}
          note="+12% vs last period"
          icon={Users}
          tone="green"
        />
        <StatCard label="Ad Spend" value="RM 8,940" icon={Coins} tone="blue" />
        <StatCard
          label="Cost / Lead"
          value="RM 6.10"
          icon={TrendingDown}
          tone="amber"
        />
        <StatCard
          label="Conversion Rate"
          value="4.8%"
          icon={Percent}
          tone="violet"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Leads over time</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart bars={LEADS_OVER_TIME} />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Spend by channel</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart bars={SPEND_BY_CHANNEL} />
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Top campaigns</h2>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">CPL</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CAMPAIGNS.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-right">{c.leads}</TableCell>
                  <TableCell className="text-right">{c.spend}</TableCell>
                  <TableCell className="text-right">{c.cpl}</TableCell>
                  <TableCell className="text-right">{c.conv}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenContainer>
  );
}
