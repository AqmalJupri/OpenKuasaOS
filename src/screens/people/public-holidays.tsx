import { Plus } from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Holiday = {
  id: string;
  date: string;
  name: string;
  type: 'National' | 'State';
  day: string;
};

const HOLIDAYS: Holiday[] = [
  { id: '1', date: '01 Jan', name: 'New Year', type: 'National', day: 'Thu' },
  { id: '2', date: '05 Feb', name: 'Thaipusam', type: 'State', day: 'Thu' },
  { id: '3', date: '17 Feb', name: 'Chinese New Year', type: 'National', day: 'Tue' },
  { id: '4', date: '18 Feb', name: 'Chinese New Year Day 2', type: 'National', day: 'Wed' },
  { id: '5', date: '21 Mar', name: 'Hari Raya Aidilfitri', type: 'National', day: 'Sat' },
  { id: '6', date: '01 May', name: 'Labour Day', type: 'National', day: 'Fri' },
  { id: '7', date: '31 May', name: 'Wesak Day', type: 'National', day: 'Sun' },
  { id: '8', date: '31 Aug', name: 'Merdeka Day', type: 'National', day: 'Mon' },
  { id: '9', date: '16 Sep', name: 'Malaysia Day', type: 'National', day: 'Wed' },
  { id: '10', date: '08 Nov', name: 'Deepavali', type: 'National', day: 'Sun' },
  { id: '11', date: '25 Dec', name: 'Christmas', type: 'National', day: 'Fri' },
];

export default function PublicHolidaysScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Public Holidays"
        subtitle="Malaysian public holidays · 2026."
        actions={
          <Button size="sm">
            <Plus className="size-4" />
            Add Holiday
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Date</TableHead>
                <TableHead>Holiday</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Day</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HOLIDAYS.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="whitespace-nowrap font-medium tabular-nums">
                    {h.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{h.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{h.type}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {h.day}
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
