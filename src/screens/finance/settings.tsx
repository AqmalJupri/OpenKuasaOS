import {
  Bell,
  Building2,
  CalendarDays,
  Hash,
  Landmark,
  ReceiptText,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
import { BentoGrid, BentoCard } from '@/components/bento/bento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type ToggleRow = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
};

const NOTIFICATIONS: ToggleRow[] = [
  {
    id: 'notify-einvois',
    label: 'e-Invois validation alerts',
    description: 'Notify me when LHDN MyInvois accepts or rejects a submission.',
    checked: true,
  },
  {
    id: 'notify-overdue',
    label: 'Overdue invoice reminders',
    description: 'Flag invoices past their due date each morning.',
    checked: true,
  },
  {
    id: 'notify-sst',
    label: 'SST return due reminders',
    description: 'Remind me two weeks before each taxable period closes.',
    checked: false,
  },
];

function ToggleItem({ row }: { row: ToggleRow }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <Label htmlFor={row.id} className="font-medium">
          {row.label}
        </Label>
        {row.description ? (
          <p className="text-sm text-muted-foreground">{row.description}</p>
        ) : null}
      </div>
      <Switch id={row.id} defaultChecked={row.checked} />
    </div>
  );
}

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Accounting Settings"
        subtitle="Company, tax, e-Invois and fiscal preferences, Saudara."
      />

      <BentoGrid>
        {/* Company */}
        <BentoCard
          title="Company"
          subtitle="Legal details used on invoices and reports"
          icon={Building2}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legal-name">Legal name</Label>
              <Input id="legal-name" defaultValue="Rimba Ventures Sdn Bhd" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reg-no">SSM registration no.</Label>
                <Input id="reg-no" defaultValue="202601012345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sst-no">SST no.</Label>
                <Input id="sst-no" defaultValue="W10-1808-12345678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Registered address</Label>
              <Input id="address" defaultValue="No. 12, Jalan Ampang, 50450 Kuala Lumpur" />
            </div>
          </div>
        </BentoCard>

        {/* Financial year */}
        <BentoCard
          title="Financial year"
          subtitle="Base currency, year-end and period locking"
          icon={CalendarDays}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="base-currency">Base currency</Label>
                <Select defaultValue="MYR">
                  <SelectTrigger id="base-currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MYR">Malaysian Ringgit (RM)</SelectItem>
                    <SelectItem value="SGD">Singapore Dollar (S$)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year-end">Year-end</Label>
                <Select defaultValue="dec">
                  <SelectTrigger id="year-end" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dec">December</SelectItem>
                    <SelectItem value="jun">June</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lock-date">Books lock date</Label>
              <Input id="lock-date" defaultValue="31/12/2025" />
            </div>
          </div>
        </BentoCard>

        {/* Tax & e-Invois */}
        <BentoCard
          title="Tax & e-Invois"
          subtitle="SST and LHDN MyInvois submission"
          icon={ReceiptText}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sst-rate">SST rate</Label>
                <Input id="sst-rate" defaultValue="6%" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tin">LHDN TIN</Label>
                <Input id="tin" defaultValue="C1234567890" />
              </div>
            </div>
            <ToggleItem
              row={{ id: 'sst-registered', label: 'SST registered', checked: true }}
            />
            <ToggleItem
              row={{
                id: 'myinvois',
                label: 'MyInvois integration',
                description: 'Submit validated invoices to LHDN automatically.',
                checked: true,
              }}
            />
            <ToggleItem
              row={{
                id: 'auto-submit',
                label: 'Auto-submit validated invoices',
                checked: true,
              }}
            />
          </div>
        </BentoCard>

        {/* Numbering */}
        <BentoCard
          title="Numbering"
          subtitle="Prefixes for documents you issue"
          icon={Hash}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoice-prefix">Invoice prefix</Label>
                <Input id="invoice-prefix" defaultValue="INV-" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bill-prefix">Bill prefix</Label>
                <Input id="bill-prefix" defaultValue="BILL-" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="credit-prefix">Credit note prefix</Label>
                <Input id="credit-prefix" defaultValue="CN-" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next-invoice">Next invoice no.</Label>
                <Input id="next-invoice" defaultValue="1043" inputMode="numeric" />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Bank & integrations */}
        <BentoCard
          title="Bank & integrations"
          subtitle="Settlement and FPX reconciliation"
          icon={Landmark}
          className="col-span-2 md:col-span-6"
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bank">Primary bank</Label>
                <Select defaultValue="maybank">
                  <SelectTrigger id="bank" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maybank">Maybank</SelectItem>
                    <SelectItem value="cimb">CIMB</SelectItem>
                    <SelectItem value="publicbank">Public Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-no">Account no.</Label>
                <Input id="account-no" defaultValue="5141-2233-4455" />
              </div>
            </div>
            <ToggleItem
              row={{
                id: 'fpx-recon',
                label: 'FPX auto-reconciliation',
                description: 'Match incoming FPX settlements to open invoices.',
                checked: true,
              }}
            />
          </div>
        </BentoCard>

        {/* Notifications */}
        <BentoCard
          title="Notifications"
          subtitle="Stay on top of filings and collections"
          icon={Bell}
          className="col-span-2 md:col-span-6"
        >
          {NOTIFICATIONS.map((row) => (
            <ToggleItem key={row.id} row={row} />
          ))}
        </BentoCard>
      </BentoGrid>

      <div className="mt-4 flex justify-end">
        <Button>Save changes</Button>
      </div>
    </ScreenContainer>
  );
}
