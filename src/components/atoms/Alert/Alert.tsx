import type { ReactNode } from 'react';
import { cn } from '@utils/cn';

export type AlertVariant = 'error' | 'success' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-brand-100 bg-brand-50 text-brand-700',
};

export function Alert({ variant = 'info', children, className }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('rounded-lg border px-4 py-3 text-sm', variantClasses[variant], className)}
    >
      {children}
    </div>
  );
}
