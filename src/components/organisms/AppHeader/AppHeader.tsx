import { Button } from '@atoms/Button';
import { Icon } from '@atoms/Icon';

export interface AppHeaderProps {
  brandName: string;
  userName: string;
  onLogout: () => void;
}

export function AppHeader({ brandName, userName, onLogout }: AppHeaderProps) {
  const initial = userName.trim().charAt(0).toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="text-lg font-bold text-brand-600">{brandName}</span>

        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
          >
            {initial}
          </span>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">{userName}</span>
          <Button variant="ghost" size="sm" leftIcon={<Icon name="logout" className="h-4 w-4" />} onClick={onLogout}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
