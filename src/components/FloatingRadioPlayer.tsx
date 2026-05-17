import { MusicToggleButton } from '@/components/v1/skiper25';
import { IBIZA_GLOBAL_RADIO_PAGE } from '@/models/branding';

/**
 * Botón flotante: Ibiza Global Radio en directo
 * (emisora de https://www.radio-espana.es/ibiza-global-radio).
 */
export default function FloatingRadioPlayer() {
  return (
    <div
      className="fixed bottom-5 right-4 z-[90] flex flex-col items-end gap-2 sm:bottom-8 sm:right-6"
      data-nocursor
    >
      <a
        href={IBIZA_GLOBAL_RADIO_PAGE}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto rounded-full bg-[#0a0a0a]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:text-[#ef4444] hover:ring-[#dc2626]/40"
      >
        Ibiza Global
      </a>
      <MusicToggleButton className="pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.45)]" />
    </div>
  );
}
