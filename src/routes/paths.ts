import type { NavItem } from '@organisms/NavMenu';

export const PATHS = {
  login: '/login',
  register: '/register',
  match: '/buscar',
  tutors: '/tutores',
  newTutor: '/tutores/nuevo',
  history: '/historial',
} as const;

/** Pantalla inicial tras iniciar sesión. */
export const HOME_PATH = PATHS.match;

export const NAVIGATION: NavItem[] = [
  { href: PATHS.match, label: 'Buscar tutor', icon: 'sparkles' },
  { href: PATHS.tutors, label: 'Tutores', icon: 'users' },
  { href: PATHS.history, label: 'Historial de asignaciones', icon: 'clipboard' },
];

/** Estado de navegación tras registrar un tutor. */
export interface TutorsLocationState {
  createdTutorName?: string;
}
