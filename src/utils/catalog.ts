import type { Modalidad, Nivel } from '@/types/domain';

/** Valores permitidos por la API. Se usan en selects/casillas, nunca en texto libre. */
export const MATERIAS = ['Calculo', 'Fisica', 'Programacion', 'Bases de Datos', 'Estadistica', 'Ingles'] as const;

export const MODALIDADES: ReadonlyArray<{ value: Modalidad; label: string }> = [
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'VIRTUAL', label: 'Virtual' },
  { value: 'AMBAS', label: 'Ambas' },
];

export const NIVELES: ReadonlyArray<{ value: Nivel; label: string }> = [
  { value: 1, label: 'Básico' },
  { value: 2, label: 'Intermedio' },
  { value: 3, label: 'Experto' },
];
