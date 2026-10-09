import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Section = {
  title: string;
  rows: { label: string; value: string }[];
};

const SECTIONS: Section[] = [
  {
    title: 'Profile',
    rows: [
      { label: 'Full name', value: 'Jon D' },
      { label: 'Employee no', value: 'EMP-000' },
      { label: 'Email', value: 'jon@openkuasa.com' },
      { label: 'Phone', value: '+60 12-345 6789' },
    ],
  },
  {
    title: 'Employment',
    rows: [
      { label: 'Department', value: 'Management' },
      { label: 'Designation', value: 'Founder' },
      { label: 'Join date', value: '01 Jan 2019' },
      { label: 'Type', value: 'Full-time' },
      { label: 'Status', value: 'Active' },
    ],
  },
  {
    title: 'Emergency Contact',
    rows: [
      { label: 'Name', value: 'Sarah D' },
      { label: 'Relationship', value: 'Spouse' },
      { label: 'Phone', value: '+60 12-888 7777' },
    ],
  },
  {
    title: 'Bank Details',
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
        subtitle="Your employment & personal details."
      />

      <div className="max-w-3xl space-y-6">
        {SECTIONS.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {s.rows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-4 border-b py-2.5 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <span className="text-right text-sm font-medium">{r.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScreenContainer>
  );
}
