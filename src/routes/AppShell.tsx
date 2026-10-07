import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '@organisms/AppHeader';
import { NavMenu } from '@organisms/NavMenu';
import { DashboardLayout } from '@templates/DashboardLayout';
import { useAuth } from '@hooks/useAuth';
import { APP_NAME } from '@/config';
import { ROLE_LABELS } from '@utils/labels';
import { ROLE_NAVIGATION } from './paths';

/** Layout de las rutas autenticadas: cabecera + menú según el rol + la página activa. */
export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ProtectedRoute garantiza que hay usuario.
  if (!user) return null;

  const items = ROLE_NAVIGATION[user.role];
  // Activa el ítem cuyo href coincide con el inicio de la ruta más larga (p. ej. /tutor/perfil antes que /tutor).
  const activeHref =
    items
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;

  return (
    <DashboardLayout
      header={
        <AppHeader brandName={APP_NAME} userName={user.name} roleLabel={ROLE_LABELS[user.role]} onLogout={logout} />
      }
      navigation={<NavMenu items={items} activeHref={activeHref} onNavigate={navigate} />}
    >
      <Outlet />
    </DashboardLayout>
  );
}
