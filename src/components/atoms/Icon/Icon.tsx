import { cn } from '@utils/cn';

const paths = {
  mail: 'M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z',
  lock: 'M7 11V8a5 5 0 0110 0v3M6 11h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  eyeOff:
    'M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9.8 9.8 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1',
  logout: 'M15 17l5-5-5-5M20 12H9M12 21H5a2 2 0 01-2-2V5a2 2 0 012-2h7',
  calendar: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  book: 'M4 19V5a2 2 0 012-2h13v14H6a2 2 0 00-2 2zm0 0a2 2 0 002 2h13',
  users: 'M16 20a4 4 0 00-8 0M12 12a3 3 0 100-6 3 3 0 000 6zM21 20a3 3 0 00-3-3M17 6a3 3 0 010 6M3 20a3 3 0 013-3M7 6a3 3 0 000 6',
  home: 'M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10',
  plus: 'M12 5v14M5 12h14',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9L12 3z',
  check: 'M5 12l5 5L20 7',
  clipboard: 'M9 3h6v3H9zM9 4.5H6a1 1 0 00-1 1V20a1 1 0 001 1h12a1 1 0 001-1V5.5a1 1 0 00-1-1h-3M9 12h6M9 16h4',
  chart: 'M5 20v-9M12 20V5M19 20v-7M3 20h18',
  arrowLeft: 'M19 12H5M11 18l-6-6 6-6',
  sparkles: 'M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8L12 3zM19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8L19 15z',
  clock: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z',
  alert: 'M12 8v5M12 16.5v.01M12 21a9 9 0 100-18 9 9 0 000 18z',
} as const;

export type IconName = keyof typeof paths;

export interface IconProps {
  name: IconName;
  className?: string;
  /** Si se define, el ícono se anuncia a lectores de pantalla; si no, es decorativo. */
  title?: string;
}

export function Icon({ name, className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path d={paths[name]} />
    </svg>
  );
}
