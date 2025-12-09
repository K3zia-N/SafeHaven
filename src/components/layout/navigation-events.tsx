'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from './loading-provider';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // When the path changes, the new page is loading.
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);

  return null;
}
