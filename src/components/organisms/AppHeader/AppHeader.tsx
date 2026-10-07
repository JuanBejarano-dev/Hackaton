import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
import { Button } from '@atoms/Button';
import { Icon } from '@atoms/Icon';

export interface AppHeaderProps {
  brandName: string;
  userName: string;
  roleLabel: string;
  onLogout: () => void;
}

export function AppHeader({ brandName, userName, roleLabel, onLogout }: AppHeaderProps) {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <span className="flex items-center gap-2 text-lg font-bold text-brand-600">
          <Icon name="sparkles" />
          {brandName}
        </span>

        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={userName} size="sm" />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
          </div>
          <Badge tone="brand">{roleLabel}</Badge>
          <Button variant="ghost" size="sm" leftIcon={<Icon name="logout" className="h-4 w-4" />} onClick={onLogout}>
            <span className="hidden sm:inline">Salir</span>
            <span className="sr-only sm:hidden">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
