import type { DayOfWeek, TimeBlock, TimeSlot } from '@/types/domain';

export const DAYS: ReadonlyArray<{ id: DayOfWeek; label: string; short: string }> = [
  { id: 'monday', label: 'Lunes', short: 'Lun' },
  { id: 'tuesday', label: 'Martes', short: 'Mar' },
  { id: 'wednesday', label: 'Miércoles', short: 'Mié' },
  { id: 'thursday', label: 'Jueves', short: 'Jue' },
  { id: 'friday', label: 'Viernes', short: 'Vie' },
  { id: 'saturday', label: 'Sábado', short: 'Sáb' },
];

export const TIME_SLOTS: ReadonlyArray<{ id: TimeSlot; label: string }> = [
  { id: '07-09', label: '7:00 – 9:00' },
  { id: '09-11', label: '9:00 – 11:00' },
  { id: '11-13', label: '11:00 – 13:00' },
  { id: '14-16', label: '14:00 – 16:00' },
  { id: '16-18', label: '16:00 – 18:00' },
  { id: '18-20', label: '18:00 – 20:00' },
];

export const isSameBlock = (a: TimeBlock, b: TimeBlock): boolean => a.day === b.day && a.slot === b.slot;

export const hasBlock = (blocks: TimeBlock[], block: TimeBlock): boolean =>
  blocks.some((candidate) => isSameBlock(candidate, block));

export const toggleBlock = (blocks: TimeBlock[], block: TimeBlock): TimeBlock[] =>
  hasBlock(blocks, block) ? blocks.filter((candidate) => !isSameBlock(candidate, block)) : [...blocks, block];

export const intersectBlocks = (a: TimeBlock[], b: TimeBlock[]): TimeBlock[] =>
  a.filter((block) => hasBlock(b, block));

const dayOrder = (day: DayOfWeek) => DAYS.findIndex((candidate) => candidate.id === day);
const slotOrder = (slot: TimeSlot) => TIME_SLOTS.findIndex((candidate) => candidate.id === slot);

export const sortBlocks = (blocks: TimeBlock[]): TimeBlock[] =>
  [...blocks].sort((a, b) => dayOrder(a.day) - dayOrder(b.day) || slotOrder(a.slot) - slotOrder(b.slot));

export function formatBlock({ day, slot }: TimeBlock): string {
  const dayLabel = DAYS.find((candidate) => candidate.id === day)?.short ?? day;
  const slotLabel = TIME_SLOTS.find((candidate) => candidate.id === slot)?.label ?? slot;
  return `${dayLabel} ${slotLabel}`;
}
