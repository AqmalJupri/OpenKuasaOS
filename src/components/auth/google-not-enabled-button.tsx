'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function GoogleNotEnabledButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => setShown(true)}
      >
        {children}
      </Button>
      {shown ? (
        <p role="status" className="text-center text-sm text-muted-foreground">
          Google sign-in isn&apos;t enabled yet.
        </p>
      ) : null}
    </div>
  );
}
