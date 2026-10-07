import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Store,
  Users2,
  Coins,
  Plug,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { PRODUCT_CARDS, PRICING_TIERS } from '@/config/marketing';
import { cn } from '@/lib/utils';

const STATS = [
  { value: '12,400+', label: 'businesses' },
  { value: '102M+', label: 'contacts managed' },
  { value: '45', label: 'industries' },
  { value: '99.9%', label: 'uptime' },
];

const VALUE_PROPS = [
  { icon: Store, title: 'Marketplace Apps', desc: 'Extend with add-ons' },
  { icon: Users2, title: 'Client Accounts', desc: 'Run books for clients' },
  { icon: Coins, title: 'AI Credits', desc: 'One balance, every tool' },
  { icon: Plug, title: 'Integrations', desc: 'WhatsApp, Meta, FPX & more' },
];

export default function LandingPage() {
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

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <Link
            href="/pricing"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Launch offer — 50% off every plan
            <ArrowRight className="size-3.5" />
          </Link>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Run the whole business
            <br />
            from one place.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Marketing, sales, people and finance — four products on one login,
            powered by Taming Sari AI. Start with the one you need most; the rest
            already know your customers and your team.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/onboarding">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/account/support">Talk to us</Link>
            </Button>
          </div>

          <div className="mt-20 grid w-full grid-cols-2 gap-8 border-t border-white/10 pt-12 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product showcase */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            One operating system
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Six products. One login.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every tool shares the same contacts, team and AI credits — so the
            work flows from a lead to a hire to a paid invoice without leaving
            OpenKuasa.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CARDS.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.key}
                href={p.href}
                className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-lg font-bold leading-tight">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.kuasa}</p>
                  </div>
                </div>
                <p className="mt-4 font-semibold">{p.tagline}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Value band */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-primary shadow-sm">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{v.title}</p>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-lg font-semibold">
              All six products, one login — and one AI that knows your whole
              business.
            </p>
            <Button asChild className="rounded-full">
              <Link href="/onboarding">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" />
            Launch promo · 50% off
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pricing on your terms
          </h2>
          <p className="mt-4 text-muted-foreground">
            The plans differ on four numbers — contacts, AI credits, team members
            and client accounts. Every product and feature is included on every
            plan.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'flex flex-col rounded-2xl border bg-card p-7 shadow-sm',
                tier.popular && 'border-primary ring-1 ring-primary',
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{tier.name}</h3>
                {tier.popular ? (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{tier.blurb}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  {tier.price}
                </span>
                <span className="pb-1 text-sm text-muted-foreground">
                  / month
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="line-through">{tier.original}</span> billed
                monthly
              </p>
              <Button
                asChild
                className="mt-5 w-full rounded-full"
                variant={tier.popular ? 'default' : 'outline'}
              >
                <Link href="/onboarding">Subscribe now</Link>
              </Button>
              <ul className="mt-6 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            See full pricing, feature comparison & FAQ
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#06110d] text-white">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Run the whole business from one place
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Start with the product you need most. The rest already know your
            customers and your team.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/onboarding">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/account/support">Talk to us</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
