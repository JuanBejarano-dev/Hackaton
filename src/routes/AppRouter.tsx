import { Navigate, Route, Routes } from 'react-router-dom';
import { HistoryPage } from '@pages/HistoryPage';
import { LoginPage } from '@pages/LoginPage';
import { MatchPage } from '@pages/MatchPage';
import { NewTutorPage } from '@pages/NewTutorPage';
import { RegisterPage } from '@pages/RegisterPage';
import { TutorsPage } from '@pages/TutorsPage';
import { AppShell } from './AppShell';
import { GuestRoute, ProtectedRoute } from './guards';
import { HOME_PATH, PATHS } from './paths';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path={PATHS.match} element={<MatchPage />} />
          <Route path={PATHS.tutors} element={<TutorsPage />} />
          <Route path={PATHS.newTutor} element={<NewTutorPage />} />
          <Route path={PATHS.history} element={<HistoryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
    </Routes>
  );
}
