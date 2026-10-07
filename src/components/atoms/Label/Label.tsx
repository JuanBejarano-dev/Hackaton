import type { HTMLAttributes } from 'react';
import { cn } from '@utils/cn';

export interface LabelProps extends HTMLAttributes<HTMLElement> {
  htmlFor?: string;
  required?: boolean;
  /** `legend` para encabezar un <fieldset> (grupos de chips, cuadrícula de horarios). */
  as?: 'label' | 'legend';
}

export function Label({ required = false, as = 'label', htmlFor, className, children, ...rest }: LabelProps) {
  const content = (
    <>
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </>
  );
  const classes = cn('block text-sm font-medium text-slate-700', className);

  return as === 'legend' ? (
    <legend className={classes} {...rest}>
      {content}
    </legend>
  ) : (
    <label htmlFor={htmlFor} className={classes} {...rest}>
      {content}
    </label>
  );
}
