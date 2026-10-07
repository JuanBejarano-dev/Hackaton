import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { DashboardPage } from '@pages/DashboardPage';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { useAuth } from '@hooks/useAuth';

interface RedirectState {
  from?: string;
}

/** Solo usuarios autenticados; si no, envía a /login recordando la ruta de origen. */
function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname } satisfies RedirectState} />;
  }
  return <Outlet />;
}

/** Solo invitados; un usuario autenticado vuelve a la ruta de origen o al dashboard. */
function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();
  const from = (location.state as RedirectState | null)?.from ?? '/dashboard';

  if (status === 'authenticated') {
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
