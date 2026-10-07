import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
  wordmark?: string;
};

/**
 * OpenKuasa brand lockup: an emerald mark with a stylized kris-blade glyph,
 * optionally followed by the wordmark.
 */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
  wordmark = 'OpenKuasa',
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground',
          markClassName,
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
          {/* kris-blade diamond */}
          <path d="M12 2.5 16.5 12 12 21.5 7.5 12Z" />
        </svg>
      </span>
      {showWordmark ? (
        <span
          className={cn(
            'text-xl font-bold tracking-tight text-foreground',
            wordmarkClassName,
          )}
        >
          {wordmark}
        </span>
      ) : null}
    </span>
  );
}
