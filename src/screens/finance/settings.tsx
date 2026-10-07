import { ScreenContainer } from '@/components/screen/screen-container';
import { PageHeader } from '@/components/screen/page-header';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

function ToggleItem({
  id,
  label,
  checked,
}: {
  id: string;
  label: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <Label htmlFor={id} className="font-medium">
        {label}
      </Label>
      <Switch id={id} defaultChecked={checked} />
    </div>
  );
}

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="Accounting Settings"
        subtitle="Currency, tax & fiscal preferences."
      />
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
            <CardDescription>Legal details used on invoices and reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legal-name">Legal name</Label>
              <Input id="legal-name" defaultValue="Rimba Ventures Sdn Bhd" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reg-no">Registration no.</Label>
                <Input id="reg-no" defaultValue="202601012345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sst-no">SST no.</Label>
                <Input id="sst-no" defaultValue="W10-1808-12345678" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency &amp; Tax</CardTitle>
            <CardDescription>Base currency and sales &amp; service tax.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="base-currency">Base currency</Label>
                <Select defaultValue="MYR">
                  <SelectTrigger id="base-currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MYR">MYR</SelectItem>
                    <SelectItem value="SGD">SGD</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sst-rate">SST rate</Label>
                <Input id="sst-rate" defaultValue="6%" />
              </div>
            </div>
            <ToggleItem id="sst-registered" label="SST registered" checked />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fiscal Year</CardTitle>
            <CardDescription>Year-end and period locking.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label htmlFor="lock-date">Books lock date</Label>
                <Input id="lock-date" defaultValue="31/12/2025" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>e-Invoice (LHDN MyInvois)</CardTitle>
            <CardDescription>Submit invoices to LHDN automatically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleItem id="myinvois" label="MyInvois integration" checked />
            <div className="space-y-2">
              <Label htmlFor="tin">TIN</Label>
              <Input id="tin" defaultValue="C1234567890" />
            </div>
            <ToggleItem id="auto-submit" label="Auto-submit validated invoices" checked />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </div>
    </ScreenContainer>
  );
}
