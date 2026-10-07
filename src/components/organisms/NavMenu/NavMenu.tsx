import { Icon, type IconName } from '@atoms/Icon';
import { cn } from '@utils/cn';
import { handleClientNavigation } from '@utils/navigation';

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

export interface NavMenuProps {
  items: NavItem[];
  activeHref: string | null;
  onNavigate: (href: string) => void;
}

/** Pestañas de navegación principal. Se desplazan horizontalmente en pantallas pequeñas. */
export function NavMenu({ items, activeHref, onNavigate }: NavMenuProps) {
  return (
    <nav aria-label="Principal" className="border-b border-slate-200 bg-white">
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
        {items.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleClientNavigation(event, item.href, onNavigate)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
                  isActive
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900',
                )}
              >
                <Icon name={item.icon} className="h-4 w-4" />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
