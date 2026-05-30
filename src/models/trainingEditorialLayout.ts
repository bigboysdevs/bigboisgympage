import { TRAINING_PLANS, type TrainingPlan } from '@/models/trainingPlans';

export type EditorialWords = {
  sans: string;
  serif: string;
};

export type EditorialMobileBlock =
  | { type: 'text'; words: EditorialWords; plan: TrainingPlan }
  | { type: 'video' };

export type EditorialDesktopCell =
  | { kind: 'text'; words: EditorialWords; split?: 'both' | 'sans' | 'serif' }
  | { kind: 'video'; flex: number };

export type EditorialDesktopRow = {
  cells: EditorialDesktopCell[];
  meta?: TrainingPlan;
};

const EDITORIAL_WORDS: EditorialWords[] = [
  { sans: 'PLAN', serif: 'MENSUAL' },
  { sans: 'ALTO', serif: 'RENDIMIENTO' },
  { sans: 'HIPER', serif: 'TROFIA' },
  { sans: 'BIG', serif: 'BOYS KITS' },
];

export function getMobileEditorialBlocks(): EditorialMobileBlock[] {
  return TRAINING_PLANS.flatMap((plan, index) => [
    { type: 'text' as const, words: EDITORIAL_WORDS[index], plan },
    { type: 'video' as const },
  ]);
}

export function getDesktopEditorialRows(): EditorialDesktopRow[] {
  const [p0, p1, p2, p3] = TRAINING_PLANS;

  return [
    {
      cells: [
        { kind: 'text', words: EDITORIAL_WORDS[0] },
        { kind: 'video', flex: 1.35 },
      ],
      meta: p0,
    },
    {
      cells: [
        { kind: 'video', flex: 0.62 },
        { kind: 'text', words: EDITORIAL_WORDS[1] },
      ],
      meta: p1,
    },
    {
      cells: [
        { kind: 'text', words: EDITORIAL_WORDS[2] },
        { kind: 'video', flex: 1.05 },
      ],
      meta: p2,
    },
    {
      cells: [
        { kind: 'video', flex: 0.78 },
        { kind: 'text', words: EDITORIAL_WORDS[3] },
      ],
      meta: p3,
    },
  ];
}
