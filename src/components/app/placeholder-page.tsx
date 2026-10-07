import { type LucideIcon } from 'lucide-react';

type PlaceholderPageProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
};

/** Empty-state scaffold for modules that aren't built out yet. */
export function PlaceholderPage({
  title,
  subtitle,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="grid h-full place-items-center p-8">
      <div className="flex max-w-md flex-col items-center text-center">
        {Icon ? (
          <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="size-7" />
          </div>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        ) : null}
        <span className="mt-6 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          Coming soon
        </span>
      </div>
    </div>
  );
}
