/** Marcas aliadas — logos en `public/partners/` (reemplaza PNG/SVG cuando tengas los oficiales). */
export type PartnerBrand = {
  id: string;
  name: string;
  logoSrc: string;
  href?: string;
};

export const PARTNER_BRANDS: PartnerBrand[] = [
  {
    id: 'optimum-nutrition',
    name: 'Optimum Nutrition',
    logoSrc: '/partners/optimum-nutrition.svg',
    href: 'https://www.optimumnutrition.com/',
  },
  {
    id: 'under-armour',
    name: 'Under Armour',
    logoSrc: '/partners/under-armour.svg',
    href: 'https://www.underarmour.com/',
  },
  {
    id: 'nike',
    name: 'Nike',
    logoSrc: '/partners/nike.svg',
    href: 'https://www.nike.com/',
  },
  {
    id: 'gatorade',
    name: 'Gatorade',
    logoSrc: '/partners/gatorade.svg',
    href: 'https://www.gatorade.com/',
  },
  {
    id: 'cellucor',
    name: 'Cellucor',
    logoSrc: '/partners/cellucor.svg',
    href: 'https://cellucor.com/',
  },
  {
    id: 'ryderwear',
    name: 'Ryderwear',
    logoSrc: '/partners/ryderwear.svg',
    href: 'https://www.ryderwear.com/',
  },
];

export const BRAND_PARTNERS_BAR_TITLE = 'Conectando marcas con fans';
