import { Sparkles, Mic, ArrowUp, BarChart3, Users, Lightbulb } from 'lucide-react';
import { ASSISTANT } from '@/config/nav';

const SUGGESTIONS = [
  { label: 'How is my business doing this month?', icon: BarChart3 },
  { label: 'How many new leads this week?', icon: Users },
  { label: 'What should I focus on right now?', icon: Lightbulb },
];

export default function CommandPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center px-6">
      <div className="mb-6 grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="size-7" />
      </div>
      <h1 className="text-center text-3xl font-bold tracking-tight">
        How can I help, Jon?
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        I&apos;m Tuah, your command center · powered by {ASSISTANT.name}
      </p>

      <div className="mt-8 flex w-full items-center gap-2 rounded-2xl border bg-background p-2 shadow-sm">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
          +
        </span>
        <span className="flex-1 px-1 text-sm text-muted-foreground">
          Ask anything…
        </span>
        <span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground">
          <Mic className="size-4" />
        </span>
        <span className="grid size-9 place-items-center rounded-full bg-foreground text-background">
          <ArrowUp className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        AI can make mistakes. Check important info.
      </p>

      <div className="mt-6 w-full space-y-1">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-accent"
            >
              <Icon className="size-4 text-muted-foreground" />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
