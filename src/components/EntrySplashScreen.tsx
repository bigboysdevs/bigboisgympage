import { HERO_LIGHTNING_IMAGE } from '@/models/branding';
import {
  ENTRY_SPLASH_BG,
  ENTRY_SPLASH_TITLE_LINES,
} from '@/models/entrySplash';
import { useEntrySplashDismiss } from '@/hooks/useEntrySplashDismiss';

export default function EntrySplashScreen() {
  const { isVisible, isExiting, exitMs } = useEntrySplashDismiss();

  if (!isVisible) return null;

  return (
    <div
      className={[
        'entry-splash fixed inset-0 z-[300] flex items-center justify-center overflow-hidden',
        isExiting ? 'entry-splash--exiting' : '',
      ].join(' ')}
      style={{
        backgroundColor: ENTRY_SPLASH_BG,
        transitionDuration: `${exitMs}ms`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Big Boys Gym — bienvenida"
      aria-busy={!isExiting}
    >
      <div className="entry-splash__content relative flex flex-col items-start justify-center px-6">
        <h1 className="entry-splash__title relative z-[1] flex flex-col items-start text-left">
          {ENTRY_SPLASH_TITLE_LINES.map((line) => (
            <span
              key={line}
              className="hero-facade-title text-[clamp(3.25rem,16vw,7.5rem)] sm:text-[clamp(4rem,14vw,8.5rem)]"
            >
              {line}
            </span>
          ))}
        </h1>

        <div className="entry-splash__bolt pointer-events-none absolute -z-[1]" aria-hidden>
          <div
            className="entry-splash__bolt-img h-full w-full"
            style={{
              WebkitMaskImage: `url(${HERO_LIGHTNING_IMAGE})`,
              maskImage: `url(${HERO_LIGHTNING_IMAGE})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
