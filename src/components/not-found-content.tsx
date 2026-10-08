import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Branded 404 body, shared by the root and in-app not-found boundaries. */
export function NotFoundContent() {
  return (
    <div className="flex max-w-md flex-col items-center px-6 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        This page wandered off
      </h1>
      <p className="mt-3 text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved. Let’s get
        you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/command">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
