import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ header, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      {header}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
