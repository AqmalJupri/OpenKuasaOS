import Link from 'next/link';
import {
  Rocket,
  Megaphone,
  SquareKanban,
  Users,
  Landmark,
  Plug,
  type LucideIcon,
} from 'lucide-react';

const DOCS: { icon: LucideIcon; title: string; desc: string; count: string }[] =
  [
    { icon: Rocket, title: 'Getting started', desc: 'Set up your workspace and invite your team', count: '8 guides' },
    { icon: Megaphone, title: 'Jebat — Ads', desc: 'Run AI ad campaigns and capture leads', count: '12 guides' },
    { icon: SquareKanban, title: 'Kasturi — CRM', desc: 'Work your pipeline and close deals', count: '15 guides' },
    { icon: Users, title: 'Lekiu — People', desc: 'Attendance, leave, payroll & performance', count: '18 guides' },
    { icon: Landmark, title: 'Bendahara — Finance', desc: 'Invoicing, e-Invoice LHDN & accounting', count: '14 guides' },
    { icon: Plug, title: 'Integrations', desc: 'Connect WhatsApp, Meta, Stripe and more', count: '9 guides' },
  ];

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tutorials &amp; Docs</h1>
        <p className="text-sm text-muted-foreground">
          Guides and how-tos for every module.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DOCS.map((d) => {
          const Icon = d.icon;
          return (
            <Link
              key={d.title}
              href="#"
              className="rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <p className="mt-3 font-semibold">{d.title}</p>
              <p className="text-sm text-muted-foreground">{d.desc}</p>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {d.count}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
