import type {
  MatchResult,
  ModalityPreference,
  TutoringRequestInput,
  TutorModality,
  TutorProfile,
} from '@/types/domain';
import { EXPERIENCE_LABELS } from '@utils/labels';
import { formatBlock, intersectBlocks, sortBlocks } from '@utils/schedule';

/*
 * SOLO PARA EL MODO MOCK.
 * El score real lo calcula el backend. Esto imita su respuesta para que el frontend
 * se pueda probar y mostrar sin servidor. No se usa cuando VITE_API_URL está definida.
 */

const WEIGHTS = { subject: 0.4, schedule: 0.3, experience: 0.2, preferences: 0.1 };

const EXPERIENCE_SCORE = { junior: 40, intermediate: 70, senior: 100 } as const;

const isModalityCompatible = (preference: ModalityPreference, offered: TutorModality): boolean =>
  preference === 'any' || offered === 'both' || preference === offered;

export function rankTutors(input: TutoringRequestInput, tutors: TutorProfile[]): MatchResult[] {
  return tutors
    .filter((tutor) => tutor.subjects.some((subject) => subject.id === input.subjectId))
    .map((tutor): MatchResult => {
      const subjectName = tutor.subjects.find((subject) => subject.id === input.subjectId)?.name ?? '';
      const matchingBlocks = sortBlocks(intersectBlocks(input.availability, tutor.availability));
      const scheduleScore = input.availability.length
        ? Math.round((matchingBlocks.length / input.availability.length) * 100)
        : 0;
      const modalityOk = isModalityCompatible(input.modality, tutor.modality);

      const criteria = [
        { key: 'subject', label: 'Domina la materia', score: 100, weight: WEIGHTS.subject },
        { key: 'schedule', label: 'Coincidencia de horario', score: scheduleScore, weight: WEIGHTS.schedule },
        {
          key: 'experience',
          label: 'Experiencia',
          score: EXPERIENCE_SCORE[tutor.experienceLevel],
          weight: WEIGHTS.experience,
        },
        { key: 'preferences', label: 'Modalidad preferida', score: modalityOk ? 100 : 0, weight: WEIGHTS.preferences },
      ];

      const score = Math.round(criteria.reduce((total, criterion) => total + criterion.score * criterion.weight, 0));

      const scheduleText = matchingBlocks.length
        ? `coincide en ${matchingBlocks.length} de ${input.availability.length} bloques de tu horario (${matchingBlocks
            .slice(0, 3)
            .map(formatBlock)
            .join(', ')}${matchingBlocks.length > 3 ? '…' : ''})`
        : 'no coincide con ninguno de tus bloques de horario';

      const justification =
        `${tutor.user.name} domina ${subjectName}, ${scheduleText}, ` +
        `tiene nivel ${EXPERIENCE_LABELS[tutor.experienceLevel].toLowerCase()}` +
        (modalityOk ? ' y ofrece la modalidad que prefieres.' : ', aunque no ofrece la modalidad que prefieres.');

      return {
        tutor: {
          ...tutor.user,
          id: tutor.id,
          experienceLevel: tutor.experienceLevel,
          modality: tutor.modality,
        },
        score,
        criteria,
        justification,
        matchingBlocks,
      };
    })
    .sort((a, b) => b.score - a.score);
}
