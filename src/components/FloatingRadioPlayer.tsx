import { MusicToggleButton } from '@/components/v1/skiper25';

/** Botón flotante para reproducir la radio en directo. */
export default function FloatingRadioPlayer() {
  return (
    <div
      className="fixed bottom-5 right-4 z-[90] sm:bottom-8 sm:right-6"
      data-nocursor
    >
      <MusicToggleButton className="pointer-events-auto shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.45)]" />
    </div>
  );
}
