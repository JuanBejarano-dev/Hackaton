import { Navigate, Route, Routes } from 'react-router-dom';
import { CoordinatorDashboardPage } from '@pages/CoordinatorDashboardPage';
import { CoordinatorRequestsPage } from '@pages/CoordinatorRequestsPage';
import { CoordinatorTutorsPage } from '@pages/CoordinatorTutorsPage';
import { LoginPage } from '@pages/LoginPage';
import { NewRequestPage } from '@pages/NewRequestPage';
import { RegisterPage } from '@pages/RegisterPage';
import { RequestDetailPage } from '@pages/RequestDetailPage';
import { StudentHomePage } from '@pages/StudentHomePage';
import { TutorHomePage } from '@pages/TutorHomePage';
import { TutorProfilePage } from '@pages/TutorProfilePage';
import { AppShell } from './AppShell';
import { GuestRoute, HomeRedirect, ProtectedRoute } from './guards';
import { PATHS } from './paths';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path={PATHS.student.home} element={<StudentHomePage />} />
            <Route path={PATHS.student.newRequest} element={<NewRequestPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
            <Route path={PATHS.tutor.home} element={<TutorHomePage />} />
            <Route path={PATHS.tutor.profile} element={<TutorProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['coordinator']} />}>
            <Route path={PATHS.coordinator.home} element={<CoordinatorDashboardPage />} />
            <Route path={PATHS.coordinator.requests} element={<CoordinatorRequestsPage />} />
            <Route path={PATHS.coordinator.tutors} element={<CoordinatorTutorsPage />} />
          </Route>

          {/* Compartida: cada rol ve una versión distinta del detalle. */}
          <Route path="/solicitudes/:requestId" element={<RequestDetailPage />} />
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
