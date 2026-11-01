import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import {
  RECOVERY_COOKIE,
  isRecoveryMarkerValid,
} from '@/lib/auth/recovery-marker';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/auth/preview-mode';

export const metadata: Metadata = {
  title: 'Set a new password · OpenKuasa',
};

const linkClass = 'font-semibold text-primary hover:underline';

export default async function ResetPasswordPage() {
  // No project, no accounts reachable: say so here. Asking createClient() for
  // a client throws, which answered this route 500 on every credential-less
  // install. The copy claims only what the missing variables prove: this
  // deployment is not connected, not that the project holds no accounts.
  if (!hasSupabaseEnv()) {
    return (
      <AuthShell>
        <div className="space-y-1.5 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            This install is not connected
          </h1>
          <p className="text-sm text-muted-foreground">
            OpenKuasa cannot access accounts until NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY are configured. With no database here
            there is no sign-in and no password to set, so add both, then open
            the reset link from your email again.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className={linkClass}>
            Back to sign in
          </Link>
        </p>
      </AuthShell>
    );
  }

  // Reaching this page requires the recovery session set by /auth/confirm.
  // Without it the link was never followed or has expired.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?notice=reset_expired');

  // Signed in, but not by a reset link opened in the last few minutes: the
  // form would be refused, so say what to do instead.
  const marker = (await cookies()).get(RECOVERY_COOKIE)?.value;
  if (!isRecoveryMarkerValid(marker, user.id)) {
    return (
      <AuthShell>
        <div className="space-y-1.5 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Open your reset link first
          </h1>
          <p className="text-sm text-muted-foreground">
            A new password can only be set here for a few minutes after you
            open the reset link from your email, in this browser. Your link may
            have been used already or timed out.
          </p>
        </div>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>
            <Link href="/forgot-password" className={linkClass}>
              Send me a new reset link
            </Link>
          </p>
          <p>
            Know your current password?{' '}
            <Link href="/account/security" className={linkClass}>
              Change it in Security settings
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="space-y-1.5 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Set a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password you&apos;ll remember.
        </p>
      </div>

      <ResetPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        Not working?{' '}
        <Link href="/forgot-password" className={linkClass}>
          Request a new reset link
        </Link>
      </p>
    </AuthShell>
  );
}
