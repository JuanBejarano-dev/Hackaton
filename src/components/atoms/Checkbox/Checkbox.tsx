import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  hasError?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hasError = false, id, className, ...rest },
  ref,
) {
  return (
    <label htmlFor={id} className={cn('inline-flex cursor-pointer items-start gap-2', className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        aria-invalid={hasError || undefined}
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-brand-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          hasError ? 'ring-2 ring-red-300 focus-visible:ring-red-500' : 'focus-visible:ring-brand-500',
        )}
        {...rest}
      />
      <span className="text-sm text-slate-600">{label}</span>
    </label>
  );
});
