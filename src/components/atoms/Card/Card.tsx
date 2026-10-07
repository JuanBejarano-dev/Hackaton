import type { HTMLAttributes } from 'react';
import { cn } from '@utils/cn';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
  padding?: 'none' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  md: 'p-4 sm:p-5',
  lg: 'p-6 sm:p-8',
} as const;

export function Card({ as: Component = 'div', padding = 'md', className, children, ...rest }: CardProps) {
  return (
    <Component
      className={cn('rounded-2xl bg-white shadow-sm ring-1 ring-slate-200', paddingClasses[padding], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
