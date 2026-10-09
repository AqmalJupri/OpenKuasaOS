import {
  Briefcase,
  Contact,
  Landmark,
  ShieldCheck,
  User,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard, BentoStat } from '@/components/bento/bento';
import { Badge } from '@/components/ui/badge';

/* ---- the employee's HR record (Rimba Ventures Sdn Bhd · Saudara) --- */

type Row = { label: string; value: string };

type RecordSection = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  span: string;
  rows: Row[];
};

const SECTIONS: RecordSection[] = [
  {
    title: 'Personal',
    subtitle: 'Your personal details',
    icon: User,
    span: 'col-span-2 md:col-span-6',
    rows: [
      { label: 'Full name', value: 'Saudara' },
      { label: 'NRIC', value: '870512-14-5678' },
      { label: 'Date of birth', value: '12 May 1987' },
      { label: 'Email', value: 'saudara@rimbaventures.com' },
      { label: 'Phone', value: '+60 12-345 6789' },
    ],
  },
  {
    title: 'Employment',
    subtitle: 'Your role at Rimba Ventures',
    icon: Briefcase,
    span: 'col-span-2 md:col-span-6',
    rows: [
      { label: 'Employee no', value: 'EMP-000' },
      { label: 'Department', value: 'Management' },
      { label: 'Designation', value: 'Founder' },
      { label: 'Join date', value: '01 Jan 2019' },
      { label: 'Type', value: 'Full-time' },
      { label: 'Status', value: 'Active' },
    ],
  },
  {
    title: 'Statutory',
    subtitle: 'EPF · SOCSO · EIS · PCB',
    icon: ShieldCheck,
    span: 'col-span-2 md:col-span-6',
    rows: [
      { label: 'EPF / KWSP no', value: '5508 8821 0043' },
      { label: 'SOCSO / PERKESO no', value: '870512-14-5678' },
      { label: 'EIS / SIP', value: 'Active (auto)' },
      { label: 'Income tax no (PCB/MTD)', value: 'SG 1058 2290' },
      { label: 'Tax resident', value: 'Yes' },
    ],
  },
  {
    title: 'Emergency Contact',
    subtitle: 'Who we call first',
    icon: Contact,
    span: 'col-span-2 md:col-span-3',
    rows: [
      { label: 'Name', value: 'Sarah D' },
      { label: 'Relationship', value: 'Spouse' },
      { label: 'Phone', value: '+60 12-888 7777' },
    ],
  },
  {
    title: 'Bank Details',
    subtitle: 'For payroll credit',
    icon: Landmark,
    span: 'col-span-2 md:col-span-3',
    rows: [
      { label: 'Bank', value: 'Maybank' },
      { label: 'Account', value: '****4321' },
    ],
  },
];

export default function RecordsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="My Records"
        subtitle="Your employment, statutory and personal details, Saudara."
        badge={<Badge variant="secondary">Active</Badge>}
      />

      <BentoGrid>
        {/* Summary KPIs */}
        <BentoCard tone="primary" className="col-span-1 md:col-span-3">
          <BentoStat label="Tenure" value="7 yrs" delta="since 2019" deltaTone="flat" onPrimary />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Leave balance" value="8.5" delta="days left" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Department" value="Mgmt" delta="Founder" deltaTone="flat" />
        </BentoCard>
        <BentoCard className="col-span-1 md:col-span-3">
          <BentoStat label="Employment" value="Full-time" delta="Permanent" deltaTone="up" />
        </BentoCard>

        {/* Record sections */}
        {SECTIONS.map((s) => (
          <BentoCard
            key={s.title}
            title={s.title}
            subtitle={s.subtitle}
            icon={s.icon}
            className={s.span}
          >
            <div>
              {s.rows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-4 border-b py-2.5 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <span className="text-right text-sm font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </BentoCard>
        ))}
      </BentoGrid>
    </ScreenContainer>
  );
}
