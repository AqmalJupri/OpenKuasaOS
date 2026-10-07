import { AlertTriangle, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Separator } from '@/components/ui/separator';

const INDUSTRIES = [
  { value: 'tech', label: 'Technology' },
  { value: 'retail', label: 'Retail' },
  { value: 'services', label: 'Services' },
  { value: 'fnb', label: 'F&B' },
];

const SIZES = ['Just me', '2-5', '6-20', '21-50', '51-200'];

const STATES = [
  { value: 'selangor', label: 'Selangor' },
  { value: 'kl', label: 'WP Kuala Lumpur' },
  { value: 'johor', label: 'Johor' },
  { value: 'penang', label: 'Pulau Pinang' },
  { value: 'perak', label: 'Perak' },
];

export default function CompanyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Company details</h1>
        <p className="text-sm text-muted-foreground">
          Your organisation&apos;s information.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="legal-name">Legal name</Label>
              <Input id="legal-name" defaultValue="Rimba Ventures Sdn Bhd" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-no">Registration no</Label>
              <Input id="reg-no" defaultValue="202601012345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sst-no">SST no</Label>
              <Input id="sst-no" defaultValue="W10-1808-12345678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue="openkuasa.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select defaultValue="tech">
                <SelectTrigger id="industry" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Company size</Label>
              <Select defaultValue="6-20">
                <SelectTrigger id="size" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address line</Label>
              <Input id="address" placeholder="Street, building, unit" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue="Kuala Lumpur" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select defaultValue="kl">
                <SelectTrigger id="state" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input id="postcode" defaultValue="50088" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>

        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              Danger zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Export workspace data</p>
                <p className="text-sm text-muted-foreground">
                  Download all your data as a ZIP.
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download />
                Export
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Delete workspace</p>
                <p className="text-sm text-muted-foreground">
                  Permanently remove Rimba Ventures Sdn Bhd and all its data.
                  This cannot be undone.
                </p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 />
                Delete workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
