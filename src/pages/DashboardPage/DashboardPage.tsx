import { Alert } from '@atoms/Alert';
import { AppHeader } from '@organisms/AppHeader';
import { DashboardLayout } from '@templates/DashboardLayout';
import { useAuth } from '@hooks/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

  // ProtectedRoute garantiza que hay usuario; esto solo satisface el tipado.
  if (!user) return null;

  return (
    <DashboardLayout header={<AppHeader brandName="Hackaton" userName={user.name} onLogout={logout} />}>
      <h1 className="text-2xl font-bold text-slate-900">Hola, {user.name.split(' ')[0]} 👋</h1>
      <p className="mt-1 text-slate-600">Sesión iniciada como {user.email}</p>
      <Alert variant="success" className="mt-6">
        La autenticación funciona. Reemplaza esta página por tu vista principal.
      </Alert>
    </DashboardLayout>
  );
}
