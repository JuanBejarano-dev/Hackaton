import { cn } from '@utils/cn';

export interface ProgressBarProps {
  /** Valor de 0 a 100. */
  value: number;
  /** Descripción para lectores de pantalla. */
  label: string;
  /** `auto` colorea según el valor (rojo → ámbar → marca → verde). */
  tone?: 'auto' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
}

function autoToneClass(value: number): string {
  if (value >= 75) return 'bg-emerald-500';
  if (value >= 50) return 'bg-brand-500';
  if (value >= 25) return 'bg-amber-400';
  return 'bg-red-400';
}

export function ProgressBar({ value, label, tone = 'auto', size = 'md', className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full overflow-hidden rounded-full bg-slate-100', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', tone === 'auto' ? autoToneClass(clamped) : 'bg-brand-500')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
