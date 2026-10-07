import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import type { Role } from '@/types/auth';
import { PATHS, ROLE_HOME } from './paths';

interface RedirectState {
  from?: string;
}

interface ProtectedRouteProps {
  /** Si se omite, basta con estar autenticado. */
  allowedRoles?: Role[];
}

/** Exige sesión (y rol, si se indica). Sin sesión → /login; rol incorrecto → inicio de su rol. */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname } satisfies RedirectState} />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }
  return <Outlet />;
}

/** Solo invitados. Un usuario autenticado vuelve a donde iba o al inicio de su rol. */
export function GuestRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const from = (location.state as RedirectState | null)?.from;
    return <Navigate to={from ?? ROLE_HOME[user.role]} replace />;
  }
  return <Outlet />;
}

/** Ruta raíz: envía a cada usuario al inicio de su rol. */
export function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? ROLE_HOME[user.role] : PATHS.login} replace />;
}
