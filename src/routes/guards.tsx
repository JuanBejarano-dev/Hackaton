import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { HOME_PATH, PATHS } from './paths';

interface RedirectState {
  from?: string;
}

/** Rutas privadas: sin sesión válida → /login, recordando a dónde iba el usuario. */
export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname } satisfies RedirectState} />;
  }
  return <Outlet />;
}

/** Solo invitados. Un usuario autenticado vuelve a donde iba o a la pantalla inicial. */
export function GuestRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const from = (location.state as RedirectState | null)?.from;
    return <Navigate to={from ?? HOME_PATH} replace />;
  }
  return <Outlet />;
}
