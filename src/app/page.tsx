import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';

const NAV = ['Home', 'Products', 'Pricing', 'Marketplace', 'Tutorials', 'Contact'];

const STATS = [
  { label: 'Empowering', value: '104,786', note: 'businesses' },
  { label: 'Managing', value: '102M+', note: 'contacts' },
  { label: 'Serving', value: '45', note: 'industries' },
  { label: 'Established', value: '2019', note: '' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#06110d] text-white">
      {/* backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(100% 70% at 50% 110%, oklch(0.55 0.13 164 / 0.55) 0%, transparent 60%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative">
        {/* announcement */}
        <div className="border-b border-white/10 bg-black/20">
          <p className="mx-auto max-w-7xl px-6 py-2.5 text-center text-sm text-white/70">
            Launch offer — up to 50% off for the first 1,000 teams.{' '}
            <Link href="#" className="font-semibold text-white hover:underline">
              See pricing →
            </Link>
          </p>
        </div>

        {/* nav */}
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Logo wordmarkClassName="text-white" />
          <nav className="hidden items-center gap-7 text-sm text-white/80 lg:flex">
            {NAV.map((item) => (
              <Link key={item} href="#" className="transition hover:text-white">
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Login
            </Link>
            <Button asChild className="rounded-full">
              <Link href="/onboarding">Get started</Link>
            </Button>
          </div>
        </header>

        {/* hero */}
        <main className="mx-auto max-w-7xl px-6">
          <section className="flex flex-col items-center py-24 text-center sm:py-32">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
              <span className="size-1.5 rounded-full bg-primary" />
              Powered by Taming Sari AI
            </span>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              Hello, Entrepreneurs.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Say hello to your AI-powered business operating system — marketing,
              sales, people, and finance in one place.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="#">About OpenKuasa</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/onboarding">
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>

          {/* stats */}
          <section className="grid grid-cols-2 gap-8 border-t border-white/10 py-14 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  {s.label}
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                  {s.value}
                </p>
                {s.note ? (
                  <p className="mt-1 text-sm text-white/50">{s.note}</p>
                ) : null}
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
