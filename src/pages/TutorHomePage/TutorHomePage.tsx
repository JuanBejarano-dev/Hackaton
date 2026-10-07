import { useNavigate } from 'react-router-dom';
import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { StatCard } from '@molecules/StatCard';
import { RequestList } from '@organisms/RequestList';
import { useAsyncData } from '@hooks/useAsyncData';
import { useAuth } from '@hooks/useAuth';
import { requestService } from '@services/requestService';
import { tutorService } from '@services/tutorService';
import { PATHS } from '@/routes/paths';
import { EXPERIENCE_LABELS } from '@utils/labels';

const loadTutorHome = async () => {
  const [profile, requests] = await Promise.all([tutorService.getMyProfile(), requestService.listRequests()]);
  return { profile, requests };
};

export function TutorHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error, reload } = useAsyncData(loadTutorHome);

  return (
    <>
      <PageHeader
        title={`Hola, ${user?.name.split(' ')[0] ?? ''}`}
        description="Estos son los estudiantes que el sistema te asignó como su tutor más afín."
        actions={
          <Button variant="secondary" onClick={() => navigate(PATHS.tutor.profile)}>
            Editar mi perfil
          </Button>
        }
      />

      {!data ? (
        <LoadState isLoading={isLoading} error={error} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          {(data.profile.subjects.length === 0 || data.profile.availability.length === 0) && (
            <Alert variant="info" className="flex flex-wrap items-center justify-between gap-3">
              <span>
                <strong>Completa tu perfil:</strong> sin materias y horarios el sistema no puede recomendarte a
                ningún estudiante.
              </span>
              <Button size="sm" onClick={() => navigate(PATHS.tutor.profile)}>
                Completar perfil
              </Button>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon="users" label="Estudiantes asignados" value={data.requests.length} />
            <StatCard icon="book" label="Materias que dictas" value={data.profile.subjects.length} />
            <StatCard
              icon="star"
              label="Nivel"
              value={EXPERIENCE_LABELS[data.profile.experienceLevel]}
              hint={`${data.profile.availability.length} bloques disponibles por semana`}
            />
          </div>

          <section aria-labelledby="assigned-title" className="space-y-3">
            <h2 id="assigned-title" className="text-lg font-semibold text-slate-900">
              Tutorías asignadas
            </h2>
            {data.requests.length === 0 ? (
              <EmptyState
                icon="book"
                title="Todavía no tienes estudiantes asignados"
                description="Cuando un estudiante pida ayuda en una de tus materias y coincidan en horario, aparecerá aquí."
              />
            ) : (
              <RequestList
                requests={data.requests}
                showStudent
                getHref={(request) => PATHS.requestDetail(request.id)}
                onNavigate={navigate}
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}
