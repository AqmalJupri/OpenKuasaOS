'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, LogOut, type LucideIcon } from 'lucide-react';
import { MODULES } from '@/config/modules';
import { Logo } from '@/components/brand/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type RailLinkProps = {
  href: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  active?: boolean;
};

function RailLink({ href, label, sublabel, icon: Icon, active }: RailLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            active &&
              'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground',
          )}
        >
          <Icon className="size-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <span className="font-semibold">{label}</span>
        {sublabel ? (
          <span className="ml-1.5 text-xs opacity-70">{sublabel}</span>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-16 shrink-0 flex-col items-center border-r bg-sidebar py-3">
      <Link href="/command" aria-label="OpenKuasa home" className="mb-3">
        <Logo showWordmark={false} markClassName="size-9 rounded-xl" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-1">
        {MODULES.map((m) => (
          <RailLink
            key={m.key}
            href={m.href}
            label={m.name}
            sublabel={m.tagline}
            icon={m.icon}
            active={pathname.startsWith(m.href)}
          />
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1">
        <RailLink
          href="/settings"
          label="Settings"
          icon={Settings}
          active={pathname.startsWith('/settings')}
        />
        <RailLink href="/login" label="Sign out" icon={LogOut} />
      </div>
    </aside>
  );
}
