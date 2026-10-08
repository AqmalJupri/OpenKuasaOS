import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { NotFoundContent } from '@/components/not-found-content';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link href="/" aria-label="OpenKuasa home">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center py-16">
        <NotFoundContent />
      </main>
    </div>
  );
}
