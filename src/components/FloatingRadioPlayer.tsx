import { Instagram } from 'lucide-react';
import { MusicToggleButton } from '@/components/v1/skiper25';
import { GYM_CONTACT } from '@/models/branding';
import { floatingInstagramButtonClass } from '@/lib/ctaStyles';

/** Botones flotantes — Instagram + radio en directo. */
export default function FloatingRadioPlayer() {
  return (
    <div
      className="fixed bottom-5 right-4 z-[90] flex items-center gap-3 sm:bottom-8 sm:right-6"
      data-nocursor
    >
      <a
        href={GYM_CONTACT.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={[floatingInstagramButtonClass, 'pointer-events-auto'].join(' ')}
        aria-label="Instagram — @bigboys.gym"
        title="Instagram"
      >
        <Instagram className="h-5 w-5 shrink-0" aria-hidden />
      </a>
      <MusicToggleButton className="pointer-events-auto shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.45)]" />
    </div>
  );
}
