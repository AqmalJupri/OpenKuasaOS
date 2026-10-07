import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/brand/logo';

export const metadata: Metadata = {
  title: 'Privacy Policy · OpenKuasa OS',
};

const SECTIONS = [
  {
    h: 'Information we collect',
    p: 'We collect the details you provide when you create a workspace (name, email, company) and the data you add to the product — contacts, deals, documents and invoices — so the service can function.',
  },
  {
    h: 'How we use it',
    p: 'Your data is used to operate OpenKuasa OS, power AI features, process billing, and provide support. We never sell your data, and we only share it with processors needed to run the service.',
  },
  {
    h: 'Data residency & security',
    p: 'Data is stored on secured infrastructure with encryption in transit and at rest. Access is restricted to authorised personnel and governed by role-based permissions.',
  },
  {
    h: 'e-Invoice & tax data',
    p: 'Invoicing and tax data submitted to LHDN MyInvois is transmitted only as required for compliance and retained per statutory requirements.',
  },
  {
    h: 'Your rights',
    p: 'You can access, export, correct or delete your data at any time from your account settings, or by contacting support@openkuasa.com.',
  },
  {
    h: 'Contact',
    p: 'Questions about this policy? Email privacy@openkuasa.com.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh w-full bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo />
          <Link
            href="/command"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated 7 October 2026
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-semibold">{s.h}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {s.p}
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
