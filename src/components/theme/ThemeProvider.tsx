'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const vibeTheme = useAppStore((state) => state.vibeTheme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-vibe', vibeTheme);
    }
  }, [vibeTheme]);

  return <>{children}</>;
}
