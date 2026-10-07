import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@utils/cn';

type TextLinkProps<C extends ElementType> = {
  /** Elemento a renderizar (p. ej. el Link de react-router). Por defecto <a>. */
  as?: C;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<C>, 'as' | 'children' | 'className'>;

/** Enlace con el estilo de la marca. Es polimórfico para no acoplarse al router. */
export function TextLink<C extends ElementType = 'a'>({ as, children, className, ...rest }: TextLinkProps<C>) {
  const Component = as ?? 'a';

  return (
    <Component
      className={cn(
        'font-semibold text-brand-600 underline-offset-2 hover:text-brand-700 hover:underline',
        'focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export type { TextLinkProps };
