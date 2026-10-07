import { Plus, Search, Upload } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Employee = {
  name: string;
  email: string;
  no: string;
  department: string;
  designation: string;
  type: string;
  role: string;
  status: 'Active' | 'On Leave';
};

const EMPLOYEES: Employee[] = [
  { name: 'Aisyah Rahim', email: 'aisyah@kuasa.ai', no: 'EMP-001', department: 'Sales', designation: 'Sales Executive', type: 'Full-time', role: 'Member', status: 'Active' },
  { name: 'Faiz Hakim', email: 'faiz@kuasa.ai', no: 'EMP-002', department: 'Marketing', designation: 'Designer', type: 'Full-time', role: 'Member', status: 'Active' },
  { name: 'Ahmad Zaki', email: 'zaki@kuasa.ai', no: 'EMP-003', department: 'Ops', designation: 'Ops Lead', type: 'Full-time', role: 'Manager', status: 'Active' },
  { name: 'Nurul Huda', email: 'nurul@kuasa.ai', no: 'EMP-004', department: 'Finance', designation: 'Accountant', type: 'Full-time', role: 'Member', status: 'Active' },
  { name: 'Siti Aminah', email: 'siti@kuasa.ai', no: 'EMP-005', department: 'Sales', designation: 'Sales Executive', type: 'Part-time', role: 'Member', status: 'On Leave' },
  { name: 'Lim Wei Jie', email: 'weijie@kuasa.ai', no: 'EMP-006', department: 'Ops', designation: 'Technician', type: 'Contract', role: 'Member', status: 'Active' },
];

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
        subtitle="6 employees · Lite plan"
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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Employee</TableHead>
                <TableHead>Employee No.</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EMPLOYEES.map((e) => (
                <TableRow key={e.no}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {e.name.charAt(0)}
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
                  <TableCell>
                    <StatusPill status={e.status} />
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
