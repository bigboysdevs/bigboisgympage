import { useLayoutEffect, useState } from 'react';

interface NetworkInfoLite extends EventTarget {
  readonly effectiveType?: string;
  readonly saveData?: boolean;
  addEventListener(
    type: 'change',
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: 'change',
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ): void;
}

type Conn = NetworkInfoLite | undefined;

export type FigurePerformanceMode = 'deciding' | 'static' | 'lite' | 'full';

function readProfile(): Exclude<FigurePerformanceMode, 'deciding'> {
  if (typeof window === 'undefined') return 'full';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'static';
  }

  const conn = (navigator as Navigator & { connection?: Conn }).connection;
  if (conn && 'saveData' in conn && conn.saveData) return 'static';

  const et = conn?.effectiveType;
  if (et === 'slow-2g' || et === '2g') return 'static';

  // MOBILE: RAM ≤ 2 GB → fallback PNG (misma figura; evita WebGL en dispositivos muy limitados).
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return 'static';

  if (
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(max-width: 900px)').matches ||
    et === '3g'
  ) {
    return 'lite';
  }

  return 'full';
}

export function useLogo3dPerformanceMode(): FigurePerformanceMode {
  const [mode, setMode] = useState<FigurePerformanceMode>('deciding');

  useLayoutEffect(() => {
    const apply = () => setMode(readProfile());
    apply();

    const mqHover = window.matchMedia('(hover: none)');
    const mqWidth = window.matchMedia('(max-width: 900px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    mqHover.addEventListener('change', apply);
    mqWidth.addEventListener('change', apply);
    mqReduce.addEventListener('change', apply);
    window.addEventListener('resize', apply);

    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    conn?.addEventListener?.('change', apply);

    return () => {
      mqHover.removeEventListener('change', apply);
      mqWidth.removeEventListener('change', apply);
      mqReduce.removeEventListener('change', apply);
      window.removeEventListener('resize', apply);
      conn?.removeEventListener?.('change', apply);
    };
  }, []);

  return mode;
}
