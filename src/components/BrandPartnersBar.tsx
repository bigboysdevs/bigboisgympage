import { BRAND_PARTNERS_BAR_TITLE, PARTNER_BRANDS } from '@/models/partnerBrands';

function PartnerLogo({
  name,
  logoSrc,
  href,
}: {
  name: string;
  logoSrc: string;
  href?: string;
}) {
  const img = (
    <img
      src={logoSrc}
      alt={name}
      className="brand-partners-bar__logo h-7 w-auto max-w-[9rem] object-contain object-center opacity-80 sm:h-8 md:h-9"
      width={140}
      height={36}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="brand-partners-bar__link flex shrink-0 items-center px-6 transition-opacity duration-200 hover:opacity-100 sm:px-8 md:px-10"
        aria-label={`${name} — sitio oficial`}
      >
        {img}
      </a>
    );
  }

  return (
    <div className="brand-partners-bar__link flex shrink-0 items-center px-6 sm:px-8 md:px-10">
      {img}
    </div>
  );
}

export default function BrandPartnersBar() {
  const loop = [...PARTNER_BRANDS, ...PARTNER_BRANDS];

  return (
    <section
      className="brand-partners-bar relative z-[15] w-full border-y border-[#D7E2EA]/10 bg-[#0a0a0a]/90 py-5 backdrop-blur-[2px] sm:py-6"
      aria-labelledby="brand-partners-heading"
    >
      <div className="mx-auto flex max-w-[100vw] flex-col items-center gap-4 sm:gap-5">
        <p
          id="brand-partners-heading"
          className="px-5 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D7E2EA]/55 sm:text-[11px] sm:tracking-[0.36em]"
        >
          {BRAND_PARTNERS_BAR_TITLE}
        </p>

        <div
          className="brand-partners-bar__viewport relative w-full overflow-hidden"
          aria-label="Logos de marcas aliadas"
        >
          <div className="brand-partners-bar__fade brand-partners-bar__fade--left" aria-hidden />
          <div className="brand-partners-bar__fade brand-partners-bar__fade--right" aria-hidden />

          <div className="brand-partners-bar__track flex w-max items-center">
            {loop.map((brand, index) => (
              <PartnerLogo
                key={`${brand.id}-${index}`}
                name={brand.name}
                logoSrc={brand.logoSrc}
                href={brand.href}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
