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
import { Textarea } from '@/components/ui/textarea';

type Channel = { id: string; label: string; checked: boolean };

const CHANNELS: Channel[] = [
  { id: 'ch-whatsapp', label: 'WhatsApp', checked: true },
  { id: 'ch-web', label: 'Web widget', checked: true },
  { id: 'ch-instagram', label: 'Instagram DM', checked: false },
  { id: 'ch-messenger', label: 'Messenger', checked: false },
];

export default function ChatbotScreen() {
  return (
    <ScreenContainer>
      <PageHeader
        title="AI Chatbot"
        subtitle="Your 24/7 AI responder across WhatsApp & web."
        actions={
          <>
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button size="sm">Publish</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Behaviour</CardTitle>
              <CardDescription>How Sari greets and responds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Bot name</Label>
                <Input id="bot-name" defaultValue="Sari" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot-welcome">Welcome message</Label>
                <Textarea
                  id="bot-welcome"
                  defaultValue="Hi! I'm Sari 👋 How can I help you today?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bot-tone">Tone</Label>
                <Select defaultValue="friendly">
                  <SelectTrigger id="bot-tone" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Knowledge sources</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="text-sm">Website FAQ</span>
                    <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="text-sm">Product catalog</span>
                    <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="text-sm">Price list</span>
                    <Button variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Channels</CardTitle>
            </CardHeader>
            <CardContent>
              {CHANNELS.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-2"
                >
                  <Label htmlFor={c.id}>{c.label}</Label>
                  <Switch id={c.id} defaultChecked={c.checked} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Handoff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 py-2">
                <Label htmlFor="handoff-escalate">
                  Escalate to a human after 3 unresolved replies
                </Label>
                <Switch id="handoff-escalate" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScreenContainer>
  );
}
