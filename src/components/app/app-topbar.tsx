'use client';

import { Search, Bell, CircleHelp, Coins, PanelLeftOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/app/user-menu';

export function AppTopbar({ onExpand }: { onExpand?: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      {onExpand ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          onClick={onExpand}
        >
          <PanelLeftOpen className="size-5" />
        </Button>
      ) : null}

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts, deals, people…"
          className="pl-9"
          aria-label="Search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-full border bg-muted/60 px-3 py-1.5 text-sm font-medium sm:flex">
          <Coins className="size-4 text-primary" />
          <span>27,240</span>
          <span className="text-muted-foreground">credits</span>
        </div>
        <Button variant="ghost" size="icon" aria-label="Help">
          <CircleHelp className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <UserMenu name="Jon" />
      </div>
    </header>
  );
}
