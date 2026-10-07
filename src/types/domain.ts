export type Dia = 'LUN' | 'MAR' | 'MIE' | 'JUE' | 'VIE';

export type Hora = '08' | '10' | '14' | '16';

/** Bloque de horario en formato "DIA-HORA", p. ej. "MIE-10". */
export type Horario = `${Dia}-${Hora}`;

export type Modalidad = 'PRESENCIAL' | 'VIRTUAL' | 'AMBAS';

/** 1 = Básico, 2 = Intermedio, 3 = Experto. */
export type Nivel = 1 | 2 | 3;

/** Tutor tal como lo envía y recibe la API: materias y horarios son strings separados por comas. */
export interface Tutor {
  id: number;
  nombre: string;
  materias: string;
  horarios: string;
  nivel: Nivel;
  calificacion: number;
  modalidad: Modalidad;
}

export type TutorPayload = Omit<Tutor, 'id'>;

/** Tutor con materias y horarios convertidos a listas para la UI. */
export interface TutorView extends Omit<Tutor, 'materias' | 'horarios'> {
  materias: string[];
  horarios: string[];
}

export type TutorInput = Omit<TutorView, 'id'>;

export interface DetalleCriterio {
  nombreCriterio: string;
  /** Peso del criterio, de 0 a 1. */
  peso: number;
  /** Puntaje del criterio, de 0 a 1. */
  puntaje: number;
  /** Puntos que aporta al score total (máximo: peso × 100). */
  aporte: number;
  explicacion: string;
}

export interface MatchResult {
  tutorId: number;
  nombreTutor: string;
  /** Score total de afinidad, de 0 a 100. */
  score: number;
  justificacion: string;
  horariosCoincidentes: string[];
  recomendado: boolean;
  /** true si comparte al menos un horario con el estudiante. */
  disponible: boolean;
  desglose: DetalleCriterio[];
}

export interface SolicitudMatch {
  nombreEstudiante: string;
  materia: string;
  horarios: Horario[];
  modalidad: Modalidad;
}

export interface SolicitudRegistrada {
  id: number;
  nombreEstudiante: string;
  materia: string;
  horarios: string[];
  modalidad: Modalidad;
  /** ISO UTC, p. ej. "2026-10-07T15:56:59Z". */
  fecha: string;
  asignada: boolean;
  tutorAsignadoId: number | null;
  nombreTutorAsignado: string | null;
  score: number | null;
  justificacion: string;
  candidatosEvaluados: number;
}
