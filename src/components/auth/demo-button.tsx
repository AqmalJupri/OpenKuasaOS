'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { demoSignInAction } from '@/app/(auth)/actions';

export function DemoButton() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await demoSignInAction();
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        size="lg"
        disabled={pending}
        onClick={onClick}
      >
        {pending ? 'Loading demo…' : 'Try the demo'}
      </Button>
      {error ? (
        <p role="alert" className="text-center text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
