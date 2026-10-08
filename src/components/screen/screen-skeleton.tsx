import { ScreenContainer } from '@/components/screen/screen-container';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Generic loading placeholder for a module screen: a header, a row of stat
 * cards and a table/list card. Used by route-level `loading.tsx` boundaries so
 * navigation shows structure instead of a blank flash.
 */
export function ScreenSkeleton() {
  return (
    <ScreenContainer>
      {/* header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>

      {/* stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="mt-2 h-4 w-20" />
          </div>
        ))}
      </div>

      {/* table / list card */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-24 sm:block" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}
