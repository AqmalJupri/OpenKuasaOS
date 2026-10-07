import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SESSIONS = [
  {
    device: 'MacBook Pro',
    location: 'Kuala Lumpur',
    last: 'active now',
    current: true,
  },
  {
    device: 'iPhone 15',
    location: 'Kuala Lumpur',
    last: '2h ago',
    current: false,
  },
  { device: 'Chrome', location: 'Singapore', last: '3d ago', current: false },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <p className="text-sm text-muted-foreground">
          Password, 2FA &amp; sessions.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button>Update password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Two-factor authentication</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Authenticator app</p>
              <p className="text-sm text-muted-foreground">
                Add a second step at sign-in
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch defaultChecked aria-label="Authenticator app" />
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                Enabled
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SESSIONS.map((s) => (
              <div
                key={s.device}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{s.device}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.location} · {s.last}
                  </p>
                </div>
                {s.current ? (
                  <span className="text-sm text-muted-foreground">
                    This device
                  </span>
                ) : (
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
