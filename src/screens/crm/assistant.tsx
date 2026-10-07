import {
  ArrowUp,
  MessageSquare,
  Mic,
  Phone,
  Plus,
  Sparkles,
  SquareKanban,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { ScreenContainer } from '@/components/screen/screen-container';

const SUGGESTIONS: { icon: LucideIcon; text: string }[] = [
  { icon: SquareKanban, text: 'Which deals are stuck in my pipeline?' },
  { icon: MessageSquare, text: 'Draft a follow-up to Aisyah Trading' },
  { icon: TrendingUp, text: "What's my win rate this month?" },
  { icon: Phone, text: 'Who should I call today?' },
];

export default function AssistantScreen() {
  return (
    <ScreenContainer>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center pt-16">
        <div className="mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles className="size-8" />
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight">
          How can we close more deals, Jon?
        </h1>
        <p className="mt-2 mb-8 text-center text-sm text-muted-foreground">
          I&apos;m Kasturi, your CMO — firm and relentless about the pipeline.
          Powered by Taming Sari.
        </p>

        <div className="flex w-full items-center gap-2 rounded-2xl border bg-background p-2 shadow-sm">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
            <Plus className="size-4" />
          </div>
          <div className="flex-1 truncate text-sm text-muted-foreground">
            Ask anything…
          </div>
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
            <Mic className="size-4" />
          </div>
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background">
            <ArrowUp className="size-4" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          AI can make mistakes. Check important info.
        </p>

        <div className="mt-8 w-full space-y-1">
          {SUGGESTIONS.map(({ icon: Icon, text }) => (
            <button
              key={text}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-accent"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}
