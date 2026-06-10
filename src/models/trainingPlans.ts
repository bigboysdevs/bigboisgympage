/** Planes de entrenamiento con precio — sección Entrenamientos (lista). */

/** Fallback si un plan no define clip propio. */
export const TRAINING_PREVIEW_VIDEO = '/videos/hero.mp4';

export const TRAINING_MENSUAL_PREVIEW_VIDEO = '/videos/mensualtrain.webm';
export const TRAINING_ALTO_RENDIMIENTO_PREVIEW_VIDEO = '/videos/highrendiment.webm';
export const TRAINING_HIPERTROFIA_PREVIEW_VIDEO = '/videos/mensual2.webm';
export const TRAINING_KIDS_PREVIEW_VIDEO = '/videos/kidstrain.webm';

export type TrainingPlan = {
  number: string;
  name: string;
  displayName: string;
  tag: string;
  meta: string;
  badge: string;
  price: string;
  description: string;
  previewVideo?: string;
  /** Encuadre del clip en la tira editorial (`object-position`). */
  previewVideoPosition?: string;
};

export const TRAINING_PLANS: TrainingPlan[] = [
  {
    number: '01',
    name: 'Entrenamiento mensual',
    displayName: 'Mensual',
    tag: 'BB',
    meta: 'BOX · 30 DÍAS',
    badge: 'BASE',
    price: '$110.000',
    description:
      'Acceso al box y a las sesiones del plan mensual. Entrena con la estructura del gym y el acompañamiento del equipo Big Boys.',
    previewVideo: TRAINING_MENSUAL_PREVIEW_VIDEO,
    previewVideoPosition: 'center center',
  },
  {
    number: '02',
    name: 'Personalizado alto rendimiento',
    displayName: 'Alto rendimiento',
    tag: 'BB',
    meta: '1:1 · ELITE',
    badge: 'PRO',
    price: '$500.000',
    description:
      'Entrenamientos personalizados con plan de alimentación y manejo de cargas para deportistas de alto rendimiento de cualquier deporte.',
    previewVideo: TRAINING_ALTO_RENDIMIENTO_PREVIEW_VIDEO,
    previewVideoPosition: 'center center',
  },
  {
    number: '03',
    name: 'Personalizado hipertrofia y fitness',
    displayName: 'Hipertrofia',
    tag: 'BB',
    meta: '1:1 · FITNESS',
    badge: 'PRO',
    price: '$500.000',
    description:
      'Plan personalizado de hipertrofia y fitness con alimentación a tu medida. Volumen, técnica e intensidad pensados para tus objetivos.',
    previewVideo: TRAINING_HIPERTROFIA_PREVIEW_VIDEO,
    previewVideoPosition: 'center center',
  },
  {
    number: '04',
    name: 'Gym for Kids',
    displayName: 'GYM FOR KIDS',
    tag: 'BB',
    meta: 'BOX · NIÑOS',
    badge: 'PRO',
    price: '$500.000',
    description:
      'Espacio y entrenamiento pensados para niños: técnica, diversión y acompañamiento del equipo Big Boys en un ambiente seguro.',
    previewVideo: TRAINING_KIDS_PREVIEW_VIDEO,
    previewVideoPosition: 'center 22%',
  },
];
