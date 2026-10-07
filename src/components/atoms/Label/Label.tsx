import type { LabelHTMLAttributes } from 'react';
import { cn } from '@utils/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required = false, className, children, ...rest }: LabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-slate-700', className)} {...rest}>
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
