/**
 * Espacios / zonas del gym — independientes de los planes de Entrenamientos.
 *
 * Fotos: `public/spaces/`
 *
 * hypertrophy-1.jpg    hypertrophy-2.jpg    hypertrophy-main.jpg
 * metcon-1.jpg         metcon-2.jpg         metcon-main.jpg
 * strength-1.jpg       strength-2.jpg       strength-main.jpg
 */

const GALLERY = {
  a: '/gallery/362dad12-6e49-4136-affe-ba1ca9700caf.jpg',
  b: '/gallery/70a73709-9078-4c5b-9ada-25f8df250fd0.jpg',
  c: '/gallery/24ec4dca-b6de-4cb2-b9c1-1dc7fec68472.jpg',
  d: '/gallery/5fb53f6c-3da1-4d64-9c05-76b44d2a5a41.jpg',
  e: '/gallery/e9faccdf-4785-4f78-8d11-7403e03ec843.jpg',
  f: '/gallery/image3.jpg',
} as const;

export type GymSpaceImages = {
  col1: [string, string];
  col2: string;
};

export type GymSpace = {
  number: string;
  category: string;
  name: string;
  href: string;
  ctaLabel: string;
  images: GymSpaceImages;
  fallbackImages: GymSpaceImages;
};

export const GYM_SPACES: GymSpace[] = [
  {
    number: '01',
    category: 'Piernas',
    name: 'Zona de pierna',
    href: '#contacto',
    ctaLabel: 'Visítanos',
    images: {
      col1: ['/spaces/hypertrophy-1.jpg', '/spaces/hypertrophy-2.jpg'],
      col2: '/spaces/hypertrophy-main.jpg',
    },
    fallbackImages: {
      col1: [GALLERY.a, GALLERY.b],
      col2: GALLERY.c,
    },
  },
  {
    number: '02',
    category: 'Espalda',
    name: 'Zona de espalda',
    href: '#contacto',
    ctaLabel: 'Visítanos',
    images: {
      col1: ['/spaces/metcon-1.jpg', '/spaces/metcon-2.jpg'],
      col2: '/gallery/gym-logo-machine.jpeg',
    },
    fallbackImages: {
      col1: [GALLERY.d, GALLERY.e],
      col2: '/gallery/gym-logo-machine.jpeg',
    },
  },
  {
    number: '03',
    category: 'Calentamiento y glúteo',
    name: 'Zona de calentamiento / glúteo',
    href: '#contacto',
    ctaLabel: 'Visítanos',
    images: {
      col1: ['/spaces/strength-1.jpg', '/spaces/strength-2.jpg'],
      col2: '/gallery/70a73709-9078-4c5b-9ada-25f8df250fd0.jpg',
    },
    fallbackImages: {
      col1: [GALLERY.b, GALLERY.c],
      col2: '/gallery/70a73709-9078-4c5b-9ada-25f8df250fd0.jpg',
    },
  },
];

export type GymSpaceFanItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  fallbackImage: string;
};

export type GymSpaceScrollItem = GymSpaceFanItem & {
  description: string;
  /** Ajuste por slide sin tocar la animación de scroll. */
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
};

const SPACE_DESCRIPTIONS: Record<string, string> = {
  '01':
    'Prensa, extensión y máquinas pa\' armar pierna con intención. Acá se sube volumen, se aprieta la técnica y queda esa quemadera bacana que se siente al bajar las escaleras.',
  '02':
    'Pull over, remo y poleas pa\' engrosar la espalda como manda el reglamento. Agarre firme, control en cada rep y esa V que se nota cuando te echan el ojo.',
  '03':
    'Spinning, balón y zona de activación pa\' calentar motor y despertar glúteos antes de la pesada. Movilidad, cardio suave y el pump inicial que pone el cuerpo en modo bestia.',
};

/** Secuencia scroll — una imagen principal por zona del box. */
export const GYM_SPACE_SCROLL_ITEMS: GymSpaceScrollItem[] = GYM_SPACES.map((space) => ({
  id: space.number,
  title: space.name,
  subtitle: space.category,
  description: SPACE_DESCRIPTIONS[space.number] ?? space.category,
  image: space.images.col2,
  fallbackImage: space.fallbackImages.col2,
  ...(space.number === '02'
    ? { imageFit: 'contain' as const, imagePosition: 'center center' }
    : {}),
}));

export const GYM_SPACE_FAN_ITEMS: GymSpaceFanItem[] = [
  {
    id: '01-detail-a',
    title: GYM_SPACES[0].name,
    subtitle: GYM_SPACES[0].category,
    image: GYM_SPACES[0].images.col1[0],
    fallbackImage: GYM_SPACES[0].fallbackImages.col1[0],
  },
  {
    id: '02-detail-a',
    title: GYM_SPACES[1].name,
    subtitle: GYM_SPACES[1].category,
    image: GYM_SPACES[1].images.col1[0],
    fallbackImage: GYM_SPACES[1].fallbackImages.col1[0],
  },
  {
    id: '01-hero',
    title: GYM_SPACES[0].name,
    subtitle: GYM_SPACES[0].category,
    image: GYM_SPACES[0].images.col2,
    fallbackImage: GYM_SPACES[0].fallbackImages.col2,
  },
  {
    id: '02-hero',
    title: GYM_SPACES[1].name,
    subtitle: GYM_SPACES[1].category,
    image: GYM_SPACES[1].images.col2,
    fallbackImage: GYM_SPACES[1].fallbackImages.col2,
  },
  {
    id: '03-hero',
    title: GYM_SPACES[2].name,
    subtitle: GYM_SPACES[2].category,
    image: GYM_SPACES[2].images.col2,
    fallbackImage: GYM_SPACES[2].fallbackImages.col2,
  },
  {
    id: '03-detail-a',
    title: GYM_SPACES[2].name,
    subtitle: GYM_SPACES[2].category,
    image: GYM_SPACES[2].images.col1[0],
    fallbackImage: GYM_SPACES[2].fallbackImages.col1[0],
  },
  {
    id: '01-detail-b',
    title: GYM_SPACES[0].name,
    subtitle: GYM_SPACES[0].category,
    image: GYM_SPACES[0].images.col1[1],
    fallbackImage: GYM_SPACES[0].fallbackImages.col1[1],
  },
];
