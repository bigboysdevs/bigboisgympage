import { useCallback, useEffect, useRef, useState } from 'react';
import { ENTRY_SPLASH_DISMISS_MS } from '@/models/entrySplash';

type SplashPhase = 'visible' | 'exiting' | 'hidden';

const EXIT_MS = 650;

/** Splash al entrar; se oculta solo a los 2 s (sin interacción). */
export function useEntrySplashDismiss() {
  const [phase, setPhase] = useState<SplashPhase>('visible');
  const dismissTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    dismissTimerRef.current = window.setTimeout(() => {
      setPhase('exiting');
      exitTimerRef.current = window.setTimeout(() => {
        setPhase('hidden');
      }, EXIT_MS);
    }, ENTRY_SPLASH_DISMISS_MS);

    return clearTimers;
  }, [clearTimers]);

  useEffect(() => {
    const root = document.documentElement;
    if (phase !== 'hidden') {
      root.classList.add('entry-splash-active');
    } else {
      root.classList.remove('entry-splash-active');
    }
    return () => root.classList.remove('entry-splash-active');
  }, [phase]);

  return {
    isVisible: phase !== 'hidden',
    isExiting: phase === 'exiting',
    exitMs: EXIT_MS,
  };
}
