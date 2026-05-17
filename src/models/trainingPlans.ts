/** Planes de entrenamiento con precio — sección Entrenamientos (lista). */
export type TrainingPlan = {
  number: string;
  name: string;
  price: string;
  description: string;
};

export const TRAINING_PLANS: TrainingPlan[] = [
  {
    number: '01',
    name: 'Entrenamiento mensual',
    price: '$110.000',
    description:
      'Acceso al box y a las sesiones del plan mensual. Entrena con la estructura del gym y el acompañamiento del equipo Big Boys.',
  },
  {
    number: '02',
    name: 'Personalizado alto rendimiento',
    price: '$500.000',
    description:
      'Entrenamientos personalizados con plan de alimentación y manejo de cargas para deportistas de alto rendimiento de cualquier deporte.',
  },
  {
    number: '03',
    name: 'Personalizado hipertrofia y fitness',
    price: '$500.000',
    description:
      'Plan personalizado de hipertrofia y fitness con alimentación a tu medida. Volumen, técnica e intensidad pensados para tus objetivos.',
  },
  {
    number: '04',
    name: 'Entrenamiento personalizado Big Boys Kits',
    price: '$500.000',
    description:
      'Programa personalizado con el kit Big Boys: seguimiento cercano, plan de entrenamiento y todo lo que necesitas para avanzar con el sello del gym.',
  },
];
