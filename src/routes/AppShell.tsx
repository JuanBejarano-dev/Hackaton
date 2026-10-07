import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '@organisms/AppHeader';
import { NavMenu } from '@organisms/NavMenu';
import { DashboardLayout } from '@templates/DashboardLayout';
import { useAuth } from '@hooks/useAuth';
import { APP_NAME } from '@/config';
import { NAVIGATION } from './paths';

/** Layout de las rutas privadas: cabecera + menú + la página activa. */
export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ProtectedRoute garantiza que hay usuario.
  if (!user) return null;

  // Activa el ítem cuyo href coincide con el inicio de la ruta (p. ej. /tutores/nuevo → Tutores).
  const activeHref =
    NAVIGATION.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort(
      (a, b) => b.href.length - a.href.length,
    )[0]?.href ?? null;

  return (
    <DashboardLayout
      header={<AppHeader brandName={APP_NAME} userName={user.name} onLogout={logout} />}
      navigation={<NavMenu items={NAVIGATION} activeHref={activeHref} onNavigate={navigate} />}
    >
      <Outlet />
    </DashboardLayout>
  );
}
