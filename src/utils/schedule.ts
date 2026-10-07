import type { Dia, Hora, Horario } from '@/types/domain';

export const DIAS: ReadonlyArray<{ id: Dia; label: string; short: string }> = [
  { id: 'LUN', label: 'Lunes', short: 'Lun' },
  { id: 'MAR', label: 'Martes', short: 'Mar' },
  { id: 'MIE', label: 'Miércoles', short: 'Mié' },
  { id: 'JUE', label: 'Jueves', short: 'Jue' },
  { id: 'VIE', label: 'Viernes', short: 'Vie' },
];

export const HORAS: ReadonlyArray<{ id: Hora; label: string }> = [
  { id: '08', label: '8:00' },
  { id: '10', label: '10:00' },
  { id: '14', label: '14:00' },
  { id: '16', label: '16:00' },
];

export const toHorario = (dia: Dia, hora: Hora): Horario => `${dia}-${hora}`;

export const toggleHorario = (horarios: Horario[], horario: Horario): Horario[] =>
  horarios.includes(horario) ? horarios.filter((item) => item !== horario) : [...horarios, horario];

/** "MIE-10" → "Mié 10:00". Si el formato no se reconoce, devuelve el texto original. */
export function formatHorario(horario: string): string {
  const [dia, hora] = horario.split('-');
  const diaLabel = DIAS.find((item) => item.id === dia)?.short;
  const horaLabel = HORAS.find((item) => item.id === hora)?.label ?? (hora ? `${hora}:00` : undefined);
  return diaLabel && horaLabel ? `${diaLabel} ${horaLabel}` : horario;
}
