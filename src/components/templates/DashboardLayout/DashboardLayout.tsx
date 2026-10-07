import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  header: ReactNode;
  navigation?: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ header, navigation, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 shadow-sm">
        {header}
        {navigation}
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
