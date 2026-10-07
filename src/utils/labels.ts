import type { Modalidad, Nivel } from '@/types/domain';
import { MODALIDADES, NIVELES } from './catalog';

export const nivelLabel = (nivel: Nivel): string =>
  NIVELES.find((item) => item.value === nivel)?.label ?? `Nivel ${nivel}`;

export const modalidadLabel = (modalidad: Modalidad): string =>
  MODALIDADES.find((item) => item.value === modalidad)?.label ?? modalidad;

const dateFormatter = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' });

/** Fecha ISO (UTC) mostrada en la hora local del navegador. */
export const formatDate = (iso: string): string => dateFormatter.format(new Date(iso));

export const formatScore = (score: number): string => String(Math.round(score * 10) / 10);
