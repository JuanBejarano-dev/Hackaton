export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type TimeSlot = '07-09' | '09-11' | '11-13' | '14-16' | '16-18' | '18-20';

/** Un bloque de disponibilidad: un día + una franja de 2 horas. */
export interface TimeBlock {
  day: DayOfWeek;
  slot: TimeSlot;
}

export interface Subject {
  id: string;
  name: string;
}

/** Nivel de experiencia/prioridad del tutor: a más experiencia, más peso en el score. */
export type ExperienceLevel = 'junior' | 'intermediate' | 'senior';

export type TutorModality = 'virtual' | 'in_person' | 'both';

export type ModalityPreference = 'virtual' | 'in_person' | 'any';

export interface PersonSummary {
  id: string;
  name: string;
  email: string;
}

export interface TutorProfile {
  /** Id del perfil de tutor (no del usuario). */
  id: string;
  user: PersonSummary;
  subjects: Subject[];
  availability: TimeBlock[];
  experienceLevel: ExperienceLevel;
  modality: TutorModality;
  bio: string;
}

export interface TutorProfileInput {
  subjectIds: string[];
  availability: TimeBlock[];
  modality: TutorModality;
  bio: string;
}

/** Un criterio del score calculado por el backend. */
export interface ScoreCriterion {
  key: string;
  label: string;
  /** Puntaje del criterio, de 0 a 100. */
  score: number;
  /** Peso del criterio en el score total, de 0 a 1. */
  weight: number;
}

export interface MatchResult {
  tutor: PersonSummary & {
    experienceLevel: ExperienceLevel;
    modality: TutorModality;
  };
  /** Score total de afinidad, de 0 a 100. */
  score: number;
  criteria: ScoreCriterion[];
  justification: string;
  matchingBlocks: TimeBlock[];
}

export type RequestStatus = 'pending' | 'assigned' | 'no_match';

export interface TutoringRequest {
  id: string;
  student: PersonSummary;
  subject: Subject;
  availability: TimeBlock[];
  modality: ModalityPreference;
  notes: string;
  status: RequestStatus;
  createdAt: string;
  /** Id del perfil del tutor asignado (coincide con `matches[n].tutor.id`). */
  assignedTutorId: string | null;
  /** Ranking de tutores evaluados, ordenado de mayor a menor score. */
  matches: MatchResult[];
}

export interface TutoringRequestInput {
  subjectId: string;
  availability: TimeBlock[];
  modality: ModalityPreference;
  notes: string;
}
