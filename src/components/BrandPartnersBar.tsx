import { useMemo, type CSSProperties } from 'react';
import {
  BRAND_PARTNERS_MARQUEE_MS,
  PARTNER_BRANDS,
} from '@/models/partnerBrands';

function PartnerLogo({ name, logoSrc }: { name: string; logoSrc: string }) {
  return (
    <div className="brand-partners-bar__link flex shrink-0 items-center px-6 sm:px-8 md:px-10">
      <img
        src={logoSrc}
        alt={name}
        className="brand-partners-bar__logo pointer-events-none h-7 w-auto max-w-[9rem] select-none object-contain object-center opacity-80 sm:h-8 md:h-9"
        width={140}
        height={36}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

/** Solo CSS — sin RAF, para no pelear con el scroll táctil. */
export default function BrandPartnersBar() {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const loop = useMemo(() => [...PARTNER_BRANDS, ...PARTNER_BRANDS], []);

  return (
    <section
      className="brand-partners-bar relative z-[15] mt-[clamp(2.5rem,8vh,5rem)] w-full border-y border-white/10 bg-[#0a0a0a] py-5 sm:bg-[#0a0a0a]/90 sm:py-6 sm:backdrop-blur-[2px]"
      aria-label="Marcas aliadas"
    >
      <div className="mx-auto flex max-w-[100vw] flex-col items-center">
        <p className="sr-only">Carrusel automático de marcas aliadas.</p>

        <div
          className="brand-partners-bar__viewport relative w-full overflow-hidden"
          aria-hidden
        >
          <div className="brand-partners-bar__fade brand-partners-bar__fade--left" aria-hidden />
          <div className="brand-partners-bar__fade brand-partners-bar__fade--right" aria-hidden />

          <div
            className={[
              'brand-partners-bar__track pointer-events-none flex w-max items-center',
              reducedMotion ? '' : 'brand-partners-bar__track--auto',
            ].join(' ')}
            style={
              reducedMotion
                ? undefined
                : ({
                    '--brand-marquee-ms': `${BRAND_PARTNERS_MARQUEE_MS}ms`,
                  } as CSSProperties)
            }
          >
            {loop.map((brand, index) => (
              <PartnerLogo
                key={`${brand.id}-${index}`}
                name={brand.name}
                logoSrc={brand.logoSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
