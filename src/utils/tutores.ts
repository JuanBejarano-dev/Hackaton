import type { Tutor, TutorInput, TutorPayload, TutorView } from '@/types/domain';

/** "Calculo, Fisica" → ["Calculo", "Fisica"] */
const splitList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const toTutorView = ({ materias, horarios, ...tutor }: Tutor): TutorView => ({
  ...tutor,
  materias: splitList(materias),
  horarios: splitList(horarios),
});

export const toTutorPayload = ({ materias, horarios, ...tutor }: TutorInput): TutorPayload => ({
  ...tutor,
  materias: materias.join(','),
  horarios: horarios.join(','),
});
