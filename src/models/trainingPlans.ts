/** Planes de entrenamiento con precio — sección Entrenamientos (lista). */
export type TrainingPlan = {
  number: string;
  name: string;
  displayName: string;
  tag: string;
  meta: string;
  badge: string;
  price: string;
  description: string;
  image: string;
  video: string;
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
    image: '/gallery/gym-hack-squat.jpeg',
    video: '/videos/hero.mp4',
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
    image: '/gallery/gym-pullover-espalda.jpeg',
    video: '/videos/hero.mp4',
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
    image: '/gallery/gym-painting-bodybuilder.jpeg',
    video: '/videos/hero.mp4',
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
    image: '/gallery/gym-logo-machine.jpeg',
    video: '/videos/hero.mp4',
  },
];
