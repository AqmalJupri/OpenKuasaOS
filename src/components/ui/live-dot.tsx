import { cn } from '@/lib/utils';

/**
 * Small status indicator. When `active`, the dot emits a soft pulsing ring
 * (respects prefers-reduced-motion via Tailwind's animate-ping defaults being
 * disabled by the browser setting). Use for "live"/"active" statuses across
 * agents, campaigns, appointments, etc.
 */
export function LiveDot({
  active = true,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('relative flex size-2 shrink-0', className)} aria-hidden>
      {active ? (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:animate-none" />
      ) : null}
      <span
        className={cn(
          'relative inline-flex size-2 rounded-full',
          active ? 'bg-emerald-500' : 'bg-muted-foreground/40',
        )}
      />
    </span>
  );
}
