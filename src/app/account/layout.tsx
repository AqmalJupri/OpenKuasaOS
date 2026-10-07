import Link from 'next/link';
import { LayoutGrid, LogOut } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <Logo wordmark="OpenKuasa OS" />
          <span className="text-muted-foreground">·</span>
          <span className="font-semibold text-muted-foreground">Account</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/command"
            aria-label="Back to apps"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LayoutGrid className="size-5" />
          </Link>
          <Link
            href="/login"
            aria-label="Sign out"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="size-5" />
          </Link>
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <AccountSidebar />
        <main className="flex-1 overflow-auto bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
