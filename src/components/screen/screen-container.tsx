import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Standard content wrapper for module screens.
 *
 * Centers content in a comfortable max width with a consistent padding scale,
 * so screens don't shove content to one side or overflow the dynamic viewport.
 */
export function ScreenContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6', className)}>
      {children}
    </div>
  );
}
