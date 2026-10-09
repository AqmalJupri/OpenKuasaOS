import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Code2,
  Database,
  Plus,
  Server,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { REPO_URL } from '@/config/marketing';

const INCLUDED = [
  'All six products — Tuah, Jebat, Kasturi, Lekiu, Lekir and Bendahara',
  'Every screen and feature, with nothing held back for a paid tier',
  'No limits on contacts, team members, employees or client accounts',
  'The full source code, yours to read, change and extend',
  'No sign-up, no card and no subscription',
];

const HOSTED = [
  'Built on the same open-source software, set up and run for you',
  'Hosting, updates and backups taken care of',
  'No servers or database to manage',
  'Free to leave — move to your own self-hosted instance any time',
];

const PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Code2,
    title: 'Open source',
    body: 'Licensed under AGPL-3.0. Use it, study it and modify it. If you offer a modified version as a service, you share your changes back.',
  },
  {
    icon: Server,
    title: 'Self-host or hosted',
    body: 'Run OpenKuasa on infrastructure you control for free, or pay for the hosted version once it launches. It is the same software either way.',
  },
  {
    icon: Database,
    title: 'Your data stays yours',
    body: 'When you self-host, records live in your own database and the project never receives them. Nothing locks you in to the hosted version.',
  },
];

const STEPS = [
  {
    title: 'Get the code',
    body: 'Clone the repository from GitHub.',
    code: `git clone ${REPO_URL}.git`,
  },
  {
    title: 'Install and run',
    body: 'You need Node 20 or newer and pnpm.',
    code: 'pnpm install && pnpm dev',
  },
  {
    title: 'Connect your own services',
    body: 'Add your own Supabase project for data and sign-in. You pay your providers directly for whatever you use.',
    code: null,
  },
];

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes. OpenKuasa is free software under the AGPL-3.0 license. If you host it yourself there are no plans, no credits and nothing to subscribe to.',
  },
  {
    q: 'What will I have to pay for?',
    a: 'Only your own infrastructure — wherever you host the app and the database, plus any third-party services you choose to connect. Those costs are between you and your providers.',
  },
  {
    q: 'Is there a hosted version?',
    a: 'Not yet. A paid hosted version is planned for people who would rather not run it themselves. Pricing has not been announced, and today the only way to use OpenKuasa is to host it yourself.',
  },
  {
    q: 'Will it still be open source once there is a paid version?',
    a: 'Yes. The hosted version is built on the code in the public repository, and that code stays open source under AGPL-3.0. Paying is for the convenience of having it run for you, not for access to the software.',
  },
  {
    q: 'Is it ready to run my business on?',
    a: 'Not yet. OpenKuasa is in early development: the interface is built and runs on sample data, while the backend, AI features and integrations are still being wired up. Check the README for current status.',
  },
  {
    q: 'Who builds OpenKuasa?',
    a: 'The OpenKuasa maintainers and volunteer contributors. It is a crowd-sourced project developed in the open, and it is not affiliated with any other company or product.',
  },
  {
    q: 'Is there support?',
    a: 'Support is community-based, through issues and discussions on GitHub. There is no service-level agreement or warranty.',
  },
  {
    q: 'Can I use it commercially?',
    a: 'Yes. You can run it for your own business. If you modify it and let others use it over a network, the AGPL-3.0 requires you to make your source available to those users.',
  },
  {
    q: 'How can I help?',
    a: 'Code, design, documentation, translations and bug reports are all welcome. See CONTRIBUTING.md in the repository to get started.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#06110d] text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 60% at 50% 115%, oklch(0.55 0.13 164 / 0.55) 0%, transparent 60%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:26px_26px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3.5 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/30">
            <Sparkles className="size-4" />
            Open source · AGPL-3.0
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Free to self-host
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            Run OpenKuasa on your own infrastructure at no cost. A paid hosted
            version is on the way for teams who would rather not run it
            themselves.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                Get the code
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/command">Explore the demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Two ways to run it */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-primary bg-card p-8 shadow-md ring-1 ring-primary">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Self-hosted</h2>
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                Available now
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Run it yourself, on your own infrastructure.
            </p>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">RM 0</span>
              <span className="pb-1.5 text-sm text-muted-foreground">
                forever
              </span>
            </div>
            <ul className="mt-7 flex-1 space-y-3">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full rounded-full">
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                Get the code
              </a>
            </Button>
          </div>

          <div className="flex flex-col rounded-2xl border bg-card p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Hosted</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Coming soon
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              We run it for you, for a fee.
            </p>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">Paid</span>
              <span className="pb-1.5 text-sm text-muted-foreground">
                pricing to be announced
              </span>
            </div>
            <ul className="mt-7 flex-1 space-y-3">
              {HOSTED.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="outline"
              className="mt-8 w-full rounded-full"
            >
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                Follow on GitHub for updates
              </a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title}>
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Self-hosting steps */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Host it yourself
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three steps from the repository to a running instance.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm"
              >
                <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.body}
                </p>
                {step.code ? (
                  <code className="mt-4 block overflow-x-auto rounded-lg bg-muted px-3 py-2 font-mono text-xs">
                    {step.code}
                  </code>
                ) : null}
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
            OpenKuasa is in early development and currently runs on sample
            data. It is provided as is, without warranty of any kind.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-muted-foreground">
                Self-hosting, the hosted version and the license.
              </p>
              <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
                <p className="font-semibold">Still have questions?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask the community by opening an issue on GitHub.
                </p>
                <a
                  href={`${REPO_URL}/issues`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Open an issue
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border bg-card shadow-sm"
                >
                  <summary className="flex cursor-pointer select-none items-center justify-between gap-4 p-5 font-medium list-none [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="border-t px-5 py-4 text-sm text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-[#06110d] text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 60% at 50% 115%, oklch(0.55 0.13 164 / 0.55) 0%, transparent 60%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:26px_26px]" />

        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Built in the open, by its community
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Run it, read it, improve it. OpenKuasa belongs to the people who
            build it.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                Get the code
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a
                href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noreferrer"
              >
                Contribute
              </a>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
