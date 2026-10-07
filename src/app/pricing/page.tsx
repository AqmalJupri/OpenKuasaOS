import Link from 'next/link';
import { ArrowRight, Check, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { PRICING_TIERS } from '@/config/marketing';
import { cn } from '@/lib/utils';

const ENTERPRISE_POINTS = [
  'Custom limits on contacts, AI credits, team members and client accounts',
  'Bulk account setup for groups, franchises and agencies',
  'Onboarding and data migration planned with your team',
  'Training for your team, on your own records',
  'Invoice billing and payment terms agreed with you',
  "Anything else — ask and we'll tell you plainly what we can do",
];

const PRODUCT_CHIPS = ['Jebat & Kasturi', 'Lekiu & Lekir', 'Bendahara'];

const SHARED_FEATURES = [
  'Import / Export',
  'Filter / List / Sort',
  'Custom Fields',
  'Order Form',
  'AI Landing Page',
  'Contact Redundancy',
  'Appointments',
  'Follow-up Activities',
  'Pipeline Projects',
  'Lead Forms',
  'Lead Rotator',
  'Redirect URL Rotator',
  'Email Plugin',
  'Blast Email',
  'WhatsApp Plugin',
  'Automations',
  'Smart Delays',
  'Conditional Branching',
  'Custom Reports',
  'One-Time Products',
  'Recurring Products',
  'Page Builder',
  'Custom Domain',
  'Attendance & Shifts',
  'Leave',
  'Claims',
  'Payroll & Payslips',
  'EA / CP22 / CP22A Forms',
  'KPI Goals & Evaluations',
  'Job Listings',
  'Companies / Departments',
  'Skill & Personality Tests',
  'Career Portal',
  'Invoices',
  'Quotations',
  'e-Invois LHDN Submissions',
  'Expenses & Supplier Bills',
  'Payments & Cash Book',
  'Bank Accounts & Reconciliation',
  'Customers & Suppliers',
  'Multi-currency',
];

const PLATFORM_ROWS = [
  'Jebat: Get new leads with AI',
  'Kasturi: Manage & close your leads',
  'Lekiu: Build & manage your team',
  'Lekir: Recruit & hire your next team',
  'Bendahara: Accounting & e-Invois LHDN',
];

const COMPARISON_GROUPS: { product: string; count: number; features: string[] }[] =
  [
    {
      product: 'Jebat',
      count: 26,
      features: [
        'AI Ad Studio & creatives',
        'Lead forms & scoring',
        'Lead rotator & redirect rotator',
        'AI landing pages',
        'Blast email & WhatsApp plugin',
        'Automations with smart delays',
      ],
    },
    {
      product: 'Lekiu',
      count: 17,
      features: [
        'Attendance & shifts',
        'Leave & claims',
        'Payroll & payslips',
        'EA / CP22 / CP22A forms',
        'KPI goals & evaluations',
        'Employee self-service',
      ],
    },
    {
      product: 'Bendahara',
      count: 11,
      features: [
        'Invoices & quotations',
        'e-Invois LHDN submissions',
        'Expenses & supplier bills',
        'Payments & cash book',
        'Bank accounts & reconciliation',
        'Multi-currency & SST reports',
      ],
    },
  ];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrade or downgrade anytime from your billing settings — the change is reflected on your next billing cycle, with no loss of data.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Yes. Start free and explore every product before you pay a cent. There is nothing to configure upfront.',
  },
  {
    q: 'What happens if I exceed my contact limit?',
    a: "We'll let you know as you get close. You can clean up old contacts or move up a plan — nothing is deleted and nothing breaks.",
  },
  {
    q: 'What is an AI credit?',
    a: 'A single shared balance that every product and Taming Sari draws from — ad copy, chatbot replies, receipt reading and more. Credits refresh each month.',
  },
  {
    q: 'Is yearly billing cheaper?',
    a: 'Yes. Paying yearly saves you around 20% compared with month-to-month billing.',
  },
  {
    q: 'What is a client account?',
    a: 'A separate set of books you run on behalf of a client — ideal for agencies and firms managing several businesses from one login.',
  },
  {
    q: 'Can my team members use my plan?',
    a: 'Yes. Invite team members up to your plan limit; they share the same workspace, contacts and AI credits.',
  },
  {
    q: 'Are the products different on each plan?',
    a: 'No. Every plan includes all six products and every feature. Plans differ only on contacts, AI credits, team members and client accounts.',
  },
  {
    q: 'Do I need a card to start?',
    a: 'No. You can sign up and explore without entering any card details — add a payment method only when you subscribe.',
  },
  {
    q: 'What happens if I stop paying?',
    a: 'Your account pauses and your data is kept safe. Resubscribe anytime to pick up exactly where you left off.',
  },
  {
    q: 'What happens when my AI credits run out?',
    a: 'AI features pause until your credits refresh next month. You can top up or move to a larger plan — the rest of OpenKuasa keeps working.',
  },
];

const AI_CREDITS = ['30,000', '75,000', '150,000'];

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
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Pricing on your terms
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            Transparent pricing for businesses of all sizes. No hidden fees.
          </p>

          <span className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3.5 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/30">
            <Sparkles className="size-4" />
            Launch promo · 50% off every plan
          </span>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1 text-sm">
              <span className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground">
                Monthly
              </span>
              <span className="px-4 py-1.5 font-medium text-white/60">
                Yearly (−20%)
              </span>
            </div>
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1 text-sm">
              <span className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground">
                MYR
              </span>
              <span className="px-4 py-1.5 font-medium text-white/60">USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card p-7 shadow-sm',
                tier.popular && 'border-primary shadow-md ring-1 ring-primary',
              )}
            >
              {tier.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                  Most popular
                </span>
              ) : null}

              <h3 className="text-lg font-bold">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.blurb}</p>

              <div className="mt-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    {tier.original}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                    50% OFF
                  </span>
                </div>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="pb-1 text-sm text-muted-foreground">
                    / month
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  billed monthly
                </p>
              </div>

              <Button
                asChild
                className="mt-6 w-full rounded-full"
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
            href="#credits"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            How AI credits work
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Enterprise */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-24">
        <div className="grid gap-10 rounded-2xl bg-[#0a0a0a] p-8 text-white sm:p-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Enterprise
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Need something the plans above do not cover?
            </h2>
            <p className="mt-4 text-white/70">
              Built around your request. Limits, accounts, onboarding, training
              and billing are arranged with you, not picked from a list.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 rounded-full bg-white text-[#0a0a0a] hover:bg-white/90"
            >
              <Link href="/account/support">
                Contact us
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {ENTERPRISE_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-white/80">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Same on every plan */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-24">
        <div className="grid gap-10 rounded-2xl bg-muted/40 p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The plans differ on four numbers. Everything else is included.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Contacts, AI credits, team members and client accounts are the
              only limits. The products and the features are the same whether
              you pay RM 199 or RM 999.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {PRODUCT_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium"
                >
                  <Check className="size-3.5 text-primary" />
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SHARED_FEATURES.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs"
              >
                <Check className="size-3.5 shrink-0 text-primary" />
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison */}
      <section
        id="credits"
        className="mx-auto max-w-5xl scroll-mt-20 px-6 pb-20 sm:pb-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Feature Comparison
          </h2>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <div className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              ∞
            </span>
            <span>
              <span className="font-semibold">Unlimited</span>
              <span className="text-muted-foreground"> · no cap on this</span>
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <span className="font-semibold">Included</span>
              <span className="text-muted-foreground"> · on every plan</span>
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <span className="font-semibold">Uses AI credits</span>
              <span className="text-muted-foreground"> · drawn monthly</span>
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Features</TableHead>
                <TableHead className="text-center">Lite</TableHead>
                <TableHead className="text-center">Plus</TableHead>
                <TableHead className="text-center">Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableCell
                  colSpan={4}
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Platforms
                </TableCell>
              </TableRow>
              {PLATFORM_ROWS.map((row) => (
                <TableRow key={row}>
                  <TableCell className="whitespace-normal font-medium">
                    {row}
                  </TableCell>
                  {[0, 1, 2].map((i) => (
                    <TableCell key={i} className="text-center">
                      <Check className="mx-auto size-4 text-primary" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableCell
                  colSpan={4}
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  AI
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="whitespace-normal font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="size-4 text-primary" />
                    AI Credits / month
                  </span>
                </TableCell>
                {AI_CREDITS.map((credits, i) => (
                  <TableCell
                    key={credits}
                    className={cn(
                      'text-center',
                      i === 1 && 'font-bold text-foreground',
                    )}
                  >
                    {credits}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 space-y-3">
          {COMPARISON_GROUPS.map((group) => (
            <details
              key={group.product}
              className="group rounded-xl border bg-card shadow-sm"
            >
              <summary className="flex cursor-pointer select-none items-center justify-between gap-4 p-4 font-semibold list-none [&::-webkit-details-marker]:hidden">
                <span>
                  {group.product}{' '}
                  <span className="font-normal text-muted-foreground">
                    — {group.count} features
                  </span>
                </span>
                <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
              </summary>
              <ul className="grid gap-2 border-t px-4 py-4 sm:grid-cols-2">
                {group.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </details>
          ))}
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
                Everything you need to know about plans, limits and billing.
              </p>
              <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
                <p className="font-semibold">Still have questions?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Talk to us and we&apos;ll walk you through the right plan for
                  your business.
                </p>
                <Link
                  href="/account/support"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Talk to us
                  <ArrowRight className="size-4" />
                </Link>
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
            Ready to start growing?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Join thousands of businesses scaling with Kuasa today.
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
