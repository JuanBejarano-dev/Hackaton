import type { NavItem } from '@organisms/NavMenu';
import type { Role } from '@/types/auth';

export const PATHS = {
  login: '/login',
  register: '/register',
  student: {
    home: '/estudiante',
    newRequest: '/estudiante/solicitudes/nueva',
  },
  tutor: {
    home: '/tutor',
    profile: '/tutor/perfil',
  },
  coordinator: {
    home: '/coordinador',
    tutors: '/coordinador/tutores',
    requests: '/coordinador/solicitudes',
  },
  requestDetail: (id: string) => `/solicitudes/${id}`,
} as const;

/** Estado de navegación al abrir el detalle justo después de crear la solicitud. */
export interface RequestDetailLocationState {
  justCreated?: boolean;
}

export const ROLE_HOME: Record<Role, string> = {
  student: PATHS.student.home,
  tutor: PATHS.tutor.home,
  coordinator: PATHS.coordinator.home,
};

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  student: [
    { href: PATHS.student.home, label: 'Mis solicitudes', icon: 'clipboard' },
    { href: PATHS.student.newRequest, label: 'Nueva solicitud', icon: 'plus' },
  ],
  tutor: [
    { href: PATHS.tutor.home, label: 'Mis tutorías', icon: 'book' },
    { href: PATHS.tutor.profile, label: 'Mi perfil', icon: 'user' },
  ],
  coordinator: [
    { href: PATHS.coordinator.home, label: 'Resumen', icon: 'chart' },
    { href: PATHS.coordinator.requests, label: 'Solicitudes', icon: 'clipboard' },
    { href: PATHS.coordinator.tutors, label: 'Tutores', icon: 'users' },
  ],
};
