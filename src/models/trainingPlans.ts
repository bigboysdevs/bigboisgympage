/** Planes de entrenamiento con precio — sección Entrenamientos (lista). */

/** Video de preview al hover/tap — por ahora un solo clip para todos los planes. */
export const TRAINING_PREVIEW_VIDEO = '/videos/hero.mp4';

export type TrainingPlan = {
  number: string;
  name: string;
  displayName: string;
  tag: string;
  meta: string;
  badge: string;
  price: string;
  description: string;
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
  },
  {
    number: '04',
    name: 'Entrenamiento personalizado Big Boys Kits',
    displayName: 'Big Boys Kits',
    tag: 'BB',
    meta: '1:1 · KITS',
    badge: 'PRO',
    price: '$500.000',
    description:
      'Programa personalizado con el kit Big Boys: seguimiento cercano, plan de entrenamiento y todo lo que necesitas para avanzar con el sello del gym.',
  },
];
