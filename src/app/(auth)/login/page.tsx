import Link from 'next/link';
import type { Metadata } from 'next';
import { SplitLayout } from '@/components/brand/split-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
  title: 'Sign in · OpenKuasa OS',
};

export default function LoginPage() {
  return (
    <SplitLayout
      heading="Run your business from one place."
      subheading="Marketing, sales, people, and finance — with Taming Sari, your AI, on every screen."
      footer={
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} OpenKuasa
        </p>
      }
    >
      <div className="space-y-8">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="text-sm text-muted-foreground">
            Welcome back. Enter your details to continue.
          </p>
        </div>

        <form className="space-y-4" action="/command">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign in
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" size="lg" asChild>
          <Link href="/command">Continue with Google</Link>
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New to OpenKuasa?{' '}
          <Link
            href="/onboarding"
            className="font-semibold text-primary hover:underline"
          >
            Get started
          </Link>
        </p>
      </div>
    </SplitLayout>
  );
}
