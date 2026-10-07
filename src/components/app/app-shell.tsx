'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getProduct } from '@/config/nav';
import { ProductRail } from './product-rail';
import { SecondaryNav } from './secondary-nav';
import { AppTopbar } from './app-topbar';
import { AssistantFab } from './assistant-fab';
import { TooltipProvider } from '@/components/ui/tooltip';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const key = pathname.split('/')[1] || null;
  const product = getProduct(key ?? undefined);
  const hasSecondary = !!product && product.sections.length > 0;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-dvh w-full overflow-hidden">
        <ProductRail activeKey={key} />
        {hasSecondary && !collapsed ? (
          <SecondaryNav
            product={product!}
            onCollapse={() => setCollapsed(true)}
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar
            onExpand={
              hasSecondary && collapsed ? () => setCollapsed(false) : undefined
            }
          />
          <main className="relative flex-1 overflow-auto bg-muted/30">
            {children}
          </main>
        </div>
        <AssistantFab />
      </div>
    </TooltipProvider>
  );
}
