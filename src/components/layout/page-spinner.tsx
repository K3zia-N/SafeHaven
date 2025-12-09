'use client';

import { useLoading } from './loading-provider';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageSpinner() {
  const { isLoading } = useLoading();

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300',
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
