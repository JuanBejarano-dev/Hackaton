import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, type = 'text', className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={hasError || undefined}
      className={cn(
        'block h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors',
        'placeholder:text-slate-400',
        'focus:outline-none focus:ring-2',
        'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
        hasError
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100',
        className,
      )}
      {...rest}
    />
  );
});
