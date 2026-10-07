import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@utils/cn';

export interface ToggleChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  /** `pill` para opciones con texto, `cell` para celdas de cuadrícula. */
  shape?: 'pill' | 'cell';
}

/** Botón seleccionable (aria-pressed) para opciones de selección única o múltiple. */
export const ToggleChip = forwardRef<HTMLButtonElement, ToggleChipProps>(function ToggleChip(
  { selected, shape = 'pill', type = 'button', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 border text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        shape === 'pill' ? 'rounded-full px-3 py-1.5' : 'h-9 w-full rounded-md',
        selected
          ? 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700'
          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-700',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
