'use client';

import { Sparkles } from 'lucide-react';
import { ASSISTANT } from '@/config/modules';

/**
 * Taming Sari — the cross-app AI assistant. Floating entry point on every
 * dashboard screen (static for now).
 */
export function AssistantFab() {
  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Ask ${ASSISTANT.name}`}
    >
      <Sparkles className="size-4" />
      Ask {ASSISTANT.short}
    </button>
  );
}
