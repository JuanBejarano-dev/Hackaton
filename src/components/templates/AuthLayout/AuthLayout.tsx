import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  /** El formulario (organismo) que se muestra en la tarjeta. */
  children: ReactNode;
  /** Contenido bajo la tarjeta (p. ej. "¿No tienes cuenta? Regístrate"). */
  footer?: ReactNode;
  /** Contenido del panel de marca lateral (visible desde lg). */
  aside?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer, aside }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {aside && (
        <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-600 to-brand-700 lg:flex">
          <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">{aside}</div>
          <div aria-hidden="true" className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10" />
          <div aria-hidden="true" className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        </aside>
      )}

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
