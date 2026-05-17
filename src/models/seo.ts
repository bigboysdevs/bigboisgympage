import { GYM_CONTACT } from './branding';

const OG_IMAGE_PATH = '/big-boys-gym-logo-transparent.png';

/** URL pública del sitio (og:image, canonical, JSON-LD). Override con VITE_SITE_URL. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://bigboysgym.com';

export const SITE_NAME = 'Big Boys Gym';
export { OG_IMAGE_PATH };
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const SITE_DEFAULT_DESCRIPTION =
  'Big Boys Gym en Manizales — entrenamiento mensual, planes personalizados, hipertrofia, alto rendimiento y Big Boys Kits. Precios claros, resultados reales.';

export const SITE_DEFAULT_TITLE = 'Big Boys Gym — Entrena sin excusas';

export type PageSeo = {
  title: string;
  description: string;
  canonicalPath: string;
};

const ROUTE_SEO: Record<string, PageSeo> = {
  '/': {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    canonicalPath: '/',
  },
  '/tienda': {
    title: 'Tienda — Big Boys Gym',
    description:
      'Equipamiento, accesorios y suplementación Big Boys Gym en Manizales. Próximamente pedidos online y recogida en box.',
    canonicalPath: '/tienda',
  },
};

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function getPageSeo(pathname: string): PageSeo {
  const key = pathname.replace(/\/$/, '') || '/';
  return ROUTE_SEO[key] ?? ROUTE_SEO['/'];
}

/** Horarios en formato Schema.org (24h). */
function parseTime12h(value: string): string | null {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(a\.\s*m\.|p\.\s*m\.)/i);
  if (!match) return null;
  let hours = Number.parseInt(match[1], 10);
  const minutes = match[2];
  const isPm = /p\./i.test(match[3]);
  if (isPm && hours < 12) hours += 12;
  if (!isPm && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

function openingHoursFromLabel(label: string, value: string) {
  if (/cerrado/i.test(value)) return null;

  const range = value.match(
    /(\d{1,2}:\d{2}\s*a\.\s*m\.)\s*—\s*(\d{1,2}:\d{2}\s*p\.\s*m\.)/i,
  );
  if (!range) return null;

  const opens = parseTime12h(range[1]);
  const closes = parseTime12h(range[2]);
  if (!opens || !closes) return null;

  const dayMap: Record<string, string[]> = {
    'Lun — Vie': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    Sábado: ['Saturday'],
    Domingo: ['Sunday'],
  };

  const days = dayMap[label];
  if (!days) return null;

  return days.map((dayOfWeek) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek,
    opens,
    closes,
  }));
}

/** JSON-LD LocalBusiness + ExerciseGym para Google. */
export function buildGymJsonLd() {
  const [streetAddress, addressLocalityLine] = GYM_CONTACT.addressLines;
  const localityMatch = addressLocalityLine.match(/^([^,]+),\s*(.+)$/);

  const openingHoursSpecification = GYM_CONTACT.hours
    .map(({ label, value }) => openingHoursFromLabel(label, value))
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .flat();

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ExerciseGym', 'SportsActivityLocation'],
    '@id': `${SITE_URL}/#gym`,
    name: GYM_CONTACT.name,
    description: SITE_DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: OG_IMAGE_URL,
    logo: OG_IMAGE_URL,
    telephone: GYM_CONTACT.phoneDisplay,
    email: GYM_CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: localityMatch?.[1]?.trim() ?? 'Manizales',
      addressRegion: localityMatch?.[2]?.trim() ?? 'Caldas',
      addressCountry: 'CO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 5.0461215,
      longitude: -75.5047532,
    },
    hasMap: GYM_CONTACT.mapsPlaceUrl,
    sameAs: [GYM_CONTACT.instagramUrl, GYM_CONTACT.mapsPlaceUrl],
    ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
  };
}
