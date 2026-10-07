'use client';

import { useState } from 'react';
import {
  Filter,
  Columns3,
  Plus,
  Tag,
  CalendarClock,
  ChevronDown,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type Contact = {
  id: string;
  email: string;
  company: string;
  first: string;
  last: string;
  phone: string;
  country: string;
  status: string | null;
  score: number;
  pic: string | null;
  lastInteraction: string | null;
};

const CONTACTS: Contact[] = [
  {
    id: '1',
    email: 'promotion@kuasa.ai',
    company: 'Campaign Q4 2026',
    first: 'Promotion',
    last: 'Campaign Q4 2026',
    phone: '+60123456789',
    country: 'MY',
    status: null,
    score: 10,
    pic: null,
    lastInteraction: null,
  },
  {
    id: '2',
    email: 'sarah.t@work.com',
    company: 'Work Co',
    first: 'Sarah',
    last: 'Tan',
    phone: '60123456782',
    country: 'MY',
    status: 'New Leads',
    score: 92,
    pic: 'Aisyah',
    lastInteraction: 'Created',
  },
  {
    id: '3',
    email: 'nurul@gmail.com',
    company: 'Personal',
    first: 'Wan',
    last: 'Nurul',
    phone: '60123456783',
    country: 'MY',
    status: 'New Leads',
    score: 45,
    pic: 'Aisyah',
    lastInteraction: 'Created',
  },
  {
    id: '4',
    email: 'zaki@example.com',
    company: 'Example Sdn Bhd',
    first: 'Ahmad',
    last: 'Zaki',
    phone: '60123456781',
    country: 'MY',
    status: 'New Leads',
    score: 85,
    pic: 'Faiz',
    lastInteraction: 'Created',
  },
];

function LeadScore({ value }: { value: number }) {
  const tone =
    value >= 75
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : value >= 40
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
        : 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400';
  return (
    <span
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold',
        tone,
      )}
      title={`Lead score ${value}`}
    >
      {value}
    </span>
  );
}

function StatusPill({ status }: { status: string | null }) {
  if (!status)
    return <span className="text-sm text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      {status}
    </span>
  );
}

export default function ContactsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const allChecked = selected.length === CONTACTS.length && CONTACTS.length > 0;

  const toggleAll = () =>
    setSelected(allChecked ? [] : CONTACTS.map((c) => c.id));
  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  return (
    <ScreenContainer>
      <PageHeader
        title="Contacts"
        subtitle="All your leads and customers in one place."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Columns3 className="size-4" />
              Columns
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              Add Contact
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <Filter className="size-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          All Contacts
          <ChevronDown className="size-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Tag className="size-4" />
          Tags
        </Button>
        <Button variant="outline" size="sm">
          <CalendarClock className="size-4" />
          Follow-up
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>First name</TableHead>
                <TableHead>Last name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Last interaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CONTACTS.map((c) => (
                <TableRow key={c.id} data-state={selected.includes(c.id) ? 'selected' : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(c.id)}
                      onCheckedChange={() => toggle(c.id)}
                      aria-label={`Select ${c.email}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <LeadScore value={c.score} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{c.email}</p>
                        <button
                          type="button"
                          className="text-xs font-medium uppercase tracking-wide text-primary hover:underline"
                        >
                          + Add follow-up
                        </button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{c.first}</TableCell>
                  <TableCell className="whitespace-nowrap">{c.last}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {c.phone}
                  </TableCell>
                  <TableCell>{c.country}</TableCell>
                  <TableCell>
                    <StatusPill status={c.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {c.pic ?? '—'}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {c.lastInteraction ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Showing {CONTACTS.length} of {CONTACTS.length} results</span>
          {selected.length > 0 ? (
            <span>{selected.length} selected</span>
          ) : null}
        </div>
      </div>
    </ScreenContainer>
  );
}
