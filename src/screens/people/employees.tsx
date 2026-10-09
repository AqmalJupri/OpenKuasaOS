import {
  BriefcaseBusiness,
  ChartColumn,
  Filter,
  PieChart,
  Plus,
  Search,
  TrendingUp,
  UserPlus,
  Upload,
  Users,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { BarGroup, DonutStat, Sparkline, type Series, type Slice } from '@/components/charts';
import { LiveDot } from '@/components/ui/live-dot';
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

/* ---- mock data (Rimba Ventures Sdn Bhd) --------------------------- */

type Employee = {
  name: string;
  email: string;
  no: string;
  department: string;
  designation: string;
  type: string;
  role: string;
  joinDate: string;
  status: 'Active' | 'On Leave';
};

const EMPLOYEES: Employee[] = [
  { name: 'Aisyah Rahim', email: 'aisyah@openkuasa.com', no: 'EMP-001', department: 'Sales', designation: 'Sales Executive', type: 'Full-time', role: 'Member', joinDate: '12 Jan 2022', status: 'Active' },
  { name: 'Faiz Hakim', email: 'faiz@openkuasa.com', no: 'EMP-002', department: 'Marketing', designation: 'Designer', type: 'Full-time', role: 'Member', joinDate: '03 Mar 2022', status: 'Active' },
  { name: 'Ahmad Zaki', email: 'zaki@openkuasa.com', no: 'EMP-003', department: 'Ops', designation: 'Ops Lead', type: 'Full-time', role: 'Manager', joinDate: '18 Aug 2021', status: 'Active' },
  { name: 'Nurul Huda', email: 'nurul@openkuasa.com', no: 'EMP-004', department: 'Finance', designation: 'Accountant', type: 'Full-time', role: 'Member', joinDate: '27 Feb 2024', status: 'Active' },
  { name: 'Siti Aminah', email: 'siti@openkuasa.com', no: 'EMP-005', department: 'Sales', designation: 'Sales Executive', type: 'Part-time', role: 'Member', joinDate: '09 Jun 2024', status: 'On Leave' },
  { name: 'Lim Wei Jie', email: 'weijie@openkuasa.com', no: 'EMP-006', department: 'Ops', designation: 'Technician', type: 'Contract', role: 'Member', joinDate: '14 Nov 2023', status: 'Active' },
  { name: 'Siti Lestari', email: 'lestari@openkuasa.com', no: 'EMP-007', department: 'HR', designation: 'HR Executive', type: 'Full-time', role: 'Member', joinDate: '05 Feb 2025', status: 'Active' },
  { name: 'Raj Kumar', email: 'raj@openkuasa.com', no: 'EMP-008', department: 'Finance', designation: 'Finance Analyst', type: 'Full-time', role: 'Member', joinDate: '22 Jun 2025', status: 'Active' },
  { name: 'Tan Mei Ling', email: 'meiling@openkuasa.com', no: 'EMP-009', department: 'Marketing', designation: 'Content Lead', type: 'Full-time', role: 'Manager', joinDate: '16 Jul 2026', status: 'Active' },
  { name: 'Hafiz Osman', email: 'hafiz@openkuasa.com', no: 'EMP-010', department: 'Sales', designation: 'Business Development', type: 'Full-time', role: 'Member', joinDate: '08 Sep 2026', status: 'On Leave' },
];

const HEADCOUNT = EMPLOYEES.length; // 10
const DEPARTMENTS = Array.from(new Set(EMPLOYEES.map((e) => e.department))); // 5

/** Two-letter avatar initials from the first two name parts. */
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('')
    .toUpperCase();

/* Headcount by department ------------------------------------------- */
const DEPT_MIX: Slice[] = [
  { key: 'sales', label: 'Sales', value: 3, color: 'var(--chart-1)' },
  { key: 'marketing', label: 'Marketing', value: 2, color: 'var(--chart-2)' },
  { key: 'ops', label: 'Ops', value: 2, color: 'var(--chart-3)' },
  { key: 'finance', label: 'Finance', value: 2, color: 'var(--chart-4)' },
  { key: 'hr', label: 'HR', value: 1, color: 'var(--chart-5)' },
];

/* Headcount by tenure band ------------------------------------------ */
const TENURE_MIX = [
  { label: '<1 yr', count: 2 },
  { label: '1–2 yr', count: 2 },
  { label: '2–3 yr', count: 3 },
  { label: '3+ yr', count: 3 },
];
const TENURE_SERIES: Series[] = [
  { key: 'count', label: 'Employees', color: 'var(--chart-2)' },
];

/* KPI sparkline trends (last 8 quarters) ---------------------------- */
const SPARK_HEADCOUNT = [7, 7, 8, 8, 9, 9, 10, 10];
const SPARK_DEPTS = [4, 4, 4, 5, 5, 5, 5, 5];
const SPARK_JOINERS = [1, 0, 2, 1, 1, 2, 1, 2];
const SPARK_TURNOVER = [5.1, 4.8, 4.6, 4.9, 4.4, 4.5, 4.3, 4.2];

function StatusPill({ status }: { status: Employee['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'Active'
          ? 'bg-emerald-500/15 text-emerald-600'
          : 'bg-amber-500/15 text-amber-600',
      )}
    >
      {status}
    </span>
  );
}

export default function EmployeesScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Employee List"
        subtitle={`${HEADCOUNT} employees · Rimba Ventures Sdn Bhd`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" />
              Import
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              Add Employee
            </Button>
          </>
        }
      />

      <BentoGrid>
        {/* KPI row */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat
            label="Headcount"
            value={HEADCOUNT}
            delta="+1"
            onPrimary
            chart={
              <Sparkline
                data={SPARK_HEADCOUNT}
                color="var(--primary-foreground)"
                height={36}
              />
            }
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Departments"
            value={DEPARTMENTS.length}
            delta="stable"
            deltaTone="flat"
            chart={<Sparkline data={SPARK_DEPTS} color="var(--chart-2)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="New joiners"
            value="2"
            delta="last 90 days"
            deltaTone="up"
            chart={<Sparkline data={SPARK_JOINERS} color="var(--chart-1)" height={36} />}
          />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat
            label="Turnover"
            value="4.2%"
            delta="-0.1%"
            deltaTone="up"
            chart={<Sparkline data={SPARK_TURNOVER} color="var(--chart-3)" height={36} />}
          />
        </BentoCard>

        {/* Department donut + tenure bars */}
        <BentoCard
          title="Headcount by department"
          subtitle="Across the company"
          icon={PieChart}
          className="col-span-2 md:col-span-5"
        >
          <DonutStat
            data={DEPT_MIX}
            height={240}
            centerValue={String(HEADCOUNT)}
            centerLabel="employees"
          />
        </BentoCard>
        <BentoCard
          title="Headcount by tenure"
          subtitle="Years of service"
          icon={ChartColumn}
          className="col-span-2 md:col-span-7"
        >
          <BarGroup data={TENURE_MIX} series={TENURE_SERIES} height={240} />
        </BentoCard>

        {/* Quick context tiles */}
        <BentoCard
          title="Largest team"
          subtitle="By headcount"
          icon={Users}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Sales" value="3" delta="30%" deltaTone="flat" />
          <p className="mt-2 text-xs text-muted-foreground">
            Followed by Marketing, Ops and Finance at 2 each.
          </p>
        </BentoCard>
        <BentoCard
          title="Employment mix"
          subtitle="Contract types"
          icon={BriefcaseBusiness}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Full-time" value="8" delta="80%" deltaTone="up" />
          <p className="mt-2 text-xs text-muted-foreground">
            1 part-time, 1 contract — all EPF &amp; SOCSO registered.
          </p>
        </BentoCard>
        <BentoCard
          title="Avg tenure"
          subtitle="Across the team"
          icon={TrendingUp}
          className="col-span-2 md:col-span-4"
        >
          <BentoStat label="Years" value="2.6" delta="+0.3" deltaTone="up" />
          <p className="mt-2 text-xs text-muted-foreground">
            8 of 10 employees have served more than a year.
          </p>
        </BentoCard>

        {/* Employees table */}
        <BentoCard
          title="All employees"
          subtitle="Directory · Lekiu HR"
          icon={UserPlus}
          flush
          className="col-span-2 md:col-span-12"
        >
          <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search name, email, employee no…" className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="ops">Ops</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="shrink-0">
              <Filter className="size-4" />
              More
            </Button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee No.</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="whitespace-nowrap">Join date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EMPLOYEES.map((e) => (
                  <TableRow key={e.no}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {initials(e.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{e.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {e.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{e.no}</TableCell>
                    <TableCell className="whitespace-nowrap">{e.department}</TableCell>
                    <TableCell className="whitespace-nowrap">{e.designation}</TableCell>
                    <TableCell className="whitespace-nowrap">{e.type}</TableCell>
                    <TableCell className="whitespace-nowrap">{e.role}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {e.joinDate}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <LiveDot active={e.status === 'Active'} />
                        <StatusPill status={e.status} />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>
              {HEADCOUNT} employees · {DEPARTMENTS.length} departments
            </span>
            <span>{EMPLOYEES.filter((e) => e.status === 'Active').length} active</span>
          </div>
        </BentoCard>
      </BentoGrid>
    </ScreenContainer>
  );
}
