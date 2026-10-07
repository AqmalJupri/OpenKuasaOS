import { Mail, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const CHANNELS = [
  { icon: MessageSquare, title: 'Live chat', detail: 'Mon–Fri, 9am–6pm MYT' },
  { icon: Mail, title: 'Email', detail: 'support@openkuasa.com' },
  { icon: Phone, title: 'Phone', detail: '+60 3-1234 5678' },
];

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Contact Support</h1>
        <p className="text-sm text-muted-foreground">
          We usually reply within a few hours.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {CHANNELS.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <p className="mt-3 font-semibold">{c.title}</p>
              <p className="text-sm text-muted-foreground">{c.detail}</p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Describe your issue and we&apos;ll get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="What do you need help with?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={5}
              placeholder="Tell us what's happening…"
            />
          </div>
          <div className="flex justify-end">
            <Button>Send message</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
