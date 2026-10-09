import { ClipboardList, PieChart, Plus, Scale } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { DonutStat, Sparkline, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

/* ---- mock data (Rimba Ventures Sdn Bhd · Saudara) ------------------ */

type Status = 'Approved' | 'Pending' | 'Rejected';

const STATUS_STYLES: Record<Status, string> = {
  Approved: 'bg-emerald-500/15 text-emerald-600',
  Pending: 'bg-amber-500/15 text-amber-600',
  Rejected: 'bg-red-500/15 text-red-600',
};

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

/* Leave taken this year, by type (days) — center totals to 13. */
const LEAVE_BY_TYPE: Slice[] = [
  { key: 'annual', label: 'Annual', value: 4, color: 'var(--chart-1)' },
  { key: 'medical', label: 'Medical (MC)', value: 6, color: 'var(--chart-2)' },
  { key: 'unpaid', label: 'Unpaid', value: 2, color: 'var(--chart-3)' },
  { key: 'emergency', label: 'Emergency', value: 1, color: 'var(--chart-4)' },
];

/* Statutory entitlement utilisation, per EA 1955 contract terms. */
const BALANCES = [
  { label: 'Annual', taken: 4, total: 16 },
  { label: 'Medical (MC)', taken: 6, total: 14 },
  { label: 'Emergency', taken: 1, total: 3 },
];

const COLUMNS = ['Type', 'From', 'To', 'Days', 'Status', 'Applied'];

const REQUESTS: {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: Status;
  applied: string;
}[] = [
  { id: 'LV-0104', type: 'Annual', from: '20 Oct', to: '22 Oct', days: 3, status: 'Pending', applied: '06 Oct' },
  { id: 'LV-0101', type: 'Annual', from: '13 Oct', to: '14 Oct', days: 2, status: 'Approved', applied: '01 Oct' },
  { id: 'LV-0097', type: 'Medical (MC)', from: '25 Sep', to: '25 Sep', days: 1, status: 'Approved', applied: '25 Sep' },
  { id: 'LV-0088', type: 'Emergency', from: '12 Sep', to: '12 Sep', days: 1, status: 'Rejected', applied: '12 Sep' },
  { id: 'LV-0079', type: 'Medical (MC)', from: '08 Aug', to: '09 Aug', days: 2, status: 'Approved', applied: '08 Aug' },
  { id: 'LV-0071', type: 'Unpaid', from: '18 Jul', to: '19 Jul', days: 2, status: 'Approved', applied: '10 Jul' },
  { id: 'LV-0065', type: 'Annual', from: '30 Jun', to: '30 Jun', days: 1, status: 'Approved', applied: '20 Jun' },
];

export default function LeaveScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        className="mb-3"
        title="Leave"
        subtitle="Apply for leave and track your balance, Saudara."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Apply Leave
          </Button>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Annual balance"
            value="12"
            delta="of 16 days"
            deltaTone="flat"
            onPrimary
            chart={
              <Sparkline
                data={[16, 15, 14, 14, 13, 13, 12, 12]}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Used (YTD)"
            value="13"
            delta="days"
            deltaTone="flat"
            chart={
              <Sparkline data={[2, 4, 5, 7, 9, 11, 12, 13]} color="var(--chart-1)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Pending"
            value="1"
            delta="request"
            deltaTone="flat"
            chart={
              <Sparkline data={[0, 1, 0, 2, 1, 0, 1, 1]} color="var(--chart-4)" height={36} />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="MC taken"
            value="6"
            delta="of 14 days"
            deltaTone="flat"
            chart={
              <Sparkline data={[1, 1, 2, 3, 4, 5, 5, 6]} color="var(--chart-2)" height={36} />
            }
          />
        </BentoCard>

        {/* Usage donut + entitlement breakdown */}
        <BentoCard
          title="Leave used by type"
          subtitle="This year · days taken"
          icon={PieChart}
          className="col-span-2 md:col-span-5"
        >
          <DonutStat
            data={LEAVE_BY_TYPE}
            height={230}
            centerValue="13"
            centerLabel="days taken"
          />
        </BentoCard>
        <BentoCard
          title="Entitlement used"
          subtitle="Statutory leave, per EA 1955"
          icon={Scale}
          className="col-span-2 md:col-span-7"
        >
          <ul className="flex flex-col gap-4 py-1">
            {BALANCES.map((b) => (
              <li key={b.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{b.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {b.taken} / {b.total} days
                  </span>
                </div>
                <Progress
                  value={Math.round((b.taken / b.total) * 100)}
                  className="mt-2 h-1.5"
                />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Unpaid leave: 2 days · Carry-forward: 3 days
          </p>
        </BentoCard>

        {/* Requests table */}
        <BentoCard
          title="My Requests"
          subtitle="Leave applications and their status"
          icon={ClipboardList}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="mt-3 overflow-x-auto">
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
                {REQUESTS.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap font-medium">{r.type}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.from}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.to}</TableCell>
                    <TableCell className="tabular-nums">{r.days}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={r.status === 'Pending'} />
                        <StatusPill status={r.status} />
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {r.applied}
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
