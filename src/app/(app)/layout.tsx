import { AppSidebar } from '@/components/app/app-sidebar';
import { AppTopbar } from '@/components/app/app-topbar';
import { AssistantFab } from '@/components/app/assistant-fab';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-dvh w-full overflow-hidden">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="relative flex-1 overflow-auto bg-muted/30">
            {children}
          </main>
        </div>
        <AssistantFab />
      </div>
    </TooltipProvider>
  );
}
