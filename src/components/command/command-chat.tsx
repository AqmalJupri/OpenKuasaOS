'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Plus,
  Mic,
  ArrowUp,
  BarChart3,
  Users,
  Lightbulb,
  Receipt,
  MessageSquare,
  Coins,
  Compass,
  Megaphone,
  UserRound,
  Landmark,
  type LucideIcon,
} from 'lucide-react';
import { ASSISTANT } from '@/config/nav';
import { ReplyCard, type CardType } from '@/components/command/reply-cards';
import { cn } from '@/lib/utils';

type Role = 'user' | 'assistant';
type Message = { id: number; role: Role; text: string; card?: CardType };

type Reply = { text: string; card?: CardType };

/** Scripted "AI" — matches a question to a canned answer + optional data card. */
function getReply(q: string): Reply {
  const t = q.toLowerCase();
  if (/(overdue|unpaid|owe|invoice|collect|receivable)/.test(t))
    return {
      text: 'You have 3 overdue invoices totalling RM 13,450 — the oldest is 18 days out. Want me to send payment reminders from Bendahara?',
      card: 'invoices',
    };
  if (/lead/.test(t))
    return {
      text: '47 new leads this week, up 18% from last week. Meta Ads is your strongest source, with WhatsApp close behind.',
      card: 'leads',
    };
  if (/(focus|priorit|should i|what.*(do|next)|today|attention)/.test(t))
    return {
      text: 'Here’s where your attention moves the needle most right now:',
      card: 'priorities',
    };
  if (
    /(business|doing|overview|month|revenue|cash|runway|margin|perform|sales|how.*going)/.test(
      t,
    )
  )
    return {
      text: 'October’s looking strong — revenue is up 12% month-on-month and your runway is healthy at 7.2 months.',
      card: 'overview',
    };
  return {
    text: `I pull your numbers across Jebat, Kasturi, Lekiu, Lekir and Bendahara. Try asking about this month’s performance, new leads, overdue invoices, or what to focus on today.`,
  };
}

const SUGGESTIONS: { label: string; icon: LucideIcon }[] = [
  { label: 'How is my business doing this month?', icon: BarChart3 },
  { label: 'How many new leads this week?', icon: Users },
  { label: 'What should I focus on right now?', icon: Lightbulb },
  { label: 'Show me overdue invoices', icon: Receipt },
];

const AGENTS: { label: string; icon: LucideIcon; prompt: string }[] = [
  { label: 'CEO', icon: Compass, prompt: 'How is my business doing this month?' },
  { label: 'CMO', icon: Megaphone, prompt: 'How many new leads this week?' },
  { label: 'CHRO', icon: UserRound, prompt: 'What should I focus on with my team?' },
  { label: 'CFO', icon: Landmark, prompt: 'Show me overdue invoices' },
];

const RECENT = [
  'October performance review',
  'Where are my leads coming from?',
  'Overdue invoices & cash',
  'Q4 hiring plan',
  'Payroll for October',
];

export function CommandChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  function send(raw: string) {
    const q = raw.trim();
    if (!q || thinking) return;
    const userMsg: Message = { id: idRef.current++, role: 'user', text: q };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    window.setTimeout(() => {
      const r = getReply(q);
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: 'assistant', text: r.text, card: r.card },
      ]);
      setThinking(false);
    }, 800);
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-full">
      {/* conversation history */}
      <aside className="hidden w-72 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="p-3">
          <button
            type="button"
            onClick={() => setMessages([])}
            className="flex w-full items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            <Plus className="size-4" />
            New chat
          </button>
        </div>
        <p className="px-4 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Recent
        </p>
        <div className="flex-1 space-y-0.5 overflow-y-auto px-2">
          {RECENT.map((title) => (
            <button
              key={title}
              type="button"
              className="flex w-full items-center gap-2.5 truncate rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <MessageSquare className="size-4 shrink-0" />
              <span className="truncate">{title}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
          <Coins className="size-4 text-primary" />
          27,240 credits left
        </div>
      </aside>

      {/* chat column */}
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10">
            <div className="w-full max-w-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Sparkles className="size-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  How can I help, Jon?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  I’m Tuah, your command center · powered by {ASSISTANT.name}
                </p>
              </div>

              <div className="mt-8">
                <Composer value={input} onChange={setInput} onSend={() => send(input)} />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  AI can make mistakes. Check important info.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {AGENTS.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => send(a.prompt)}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-accent"
                    >
                      <Icon className="size-3.5 text-primary" />
                      Ask the {a.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-1">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => send(s.label)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
                {messages.map((m) =>
                  m.role === 'user' ? (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex gap-3">
                      <SariAvatar />
                      <div className="min-w-0 flex-1 space-y-3 pt-1">
                        <p className="text-sm leading-relaxed">{m.text}</p>
                        {m.card ? <ReplyCard type={m.card} /> : null}
                      </div>
                    </div>
                  ),
                )}
                {thinking ? (
                  <div className="flex gap-3">
                    <SariAvatar />
                    <div className="flex items-center gap-1 pt-3">
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="size-2 animate-bounce rounded-full bg-muted-foreground/50"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                <div ref={endRef} />
              </div>
            </div>

            <div className="shrink-0 border-t bg-background px-6 py-4">
              <div className="mx-auto max-w-2xl">
                <Composer
                  value={input}
                  onChange={setInput}
                  onSend={() => send(input)}
                />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  AI can make mistakes. Check important info.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SariAvatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
      <Sparkles className="size-4" />
    </span>
  );
}

function Composer({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
      <button
        type="button"
        aria-label="Attach"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent"
      >
        <Plus className="size-4" />
      </button>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={1}
        placeholder="Ask anything…"
        className="max-h-40 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        aria-label="Voice"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent"
      >
        <Mic className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Send"
        onClick={onSend}
        disabled={!value.trim()}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-40"
      >
        <ArrowUp className="size-4" />
      </button>
    </div>
  );
}
