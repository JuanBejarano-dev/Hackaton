import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@atoms/Card';
import { TextLink } from '@atoms/TextLink';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { StatCard } from '@molecules/StatCard';
import { UserIdentity } from '@molecules/UserIdentity';
import { RequestList } from '@organisms/RequestList';
import { useAsyncData } from '@hooks/useAsyncData';
import { requestService } from '@services/requestService';
import { tutorService } from '@services/tutorService';
import { PATHS } from '@/routes/paths';
import { EXPERIENCE_LABELS } from '@utils/labels';
import { getAssignedMatch } from '@utils/requests';

const RECENT_LIMIT = 5;
const TOP_TUTORS_LIMIT = 5;

const loadOverview = async () => {
  const [tutors, requests] = await Promise.all([tutorService.listTutors(), requestService.listRequests()]);
  return { tutors, requests };
};

export function CoordinatorDashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, reload } = useAsyncData(loadOverview);

  if (!data) {
    return (
      <>
        <PageHeader title="Resumen del programa" />
        <LoadState isLoading={isLoading} error={error} onRetry={reload} />
      </>
    );
  }

  const { tutors, requests } = data;
  const assigned = requests.filter((request) => request.status === 'assigned');
  const unassigned = requests.length - assigned.length;
  const averageScore = assigned.length
    ? Math.round(assigned.reduce((sum, request) => sum + (getAssignedMatch(request)?.score ?? 0), 0) / assigned.length)
    : 0;

  const assignmentsByTutor = assigned.reduce<Record<string, number>>((counts, request) => {
    if (request.assignedTutorId) counts[request.assignedTutorId] = (counts[request.assignedTutorId] ?? 0) + 1;
    return counts;
  }, {});
  const topTutors = [...tutors]
    .sort((a, b) => (assignmentsByTutor[b.id] ?? 0) - (assignmentsByTutor[a.id] ?? 0))
    .slice(0, TOP_TUTORS_LIMIT);

  return (
    <>
      <PageHeader
        title="Resumen del programa"
        description="Estado de las solicitudes y de la asignación automática de tutores."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="users" label="Tutores registrados" value={tutors.length} />
        <StatCard icon="clipboard" label="Solicitudes" value={requests.length} />
        <StatCard
          icon="check"
          label="Asignadas automáticamente"
          value={assigned.length}
          hint={unassigned > 0 ? `${unassigned} sin tutor disponible` : 'Todas con tutor'}
        />
        <StatCard icon="star" label="Score promedio" value={assigned.length ? `${averageScore}/100` : '—'} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section aria-labelledby="recent-title" className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 id="recent-title" className="text-lg font-semibold text-slate-900">
              Solicitudes recientes
            </h2>
            <TextLink as={Link} to={PATHS.coordinator.requests} className="text-sm">
              Ver todas
            </TextLink>
          </div>
          {requests.length === 0 ? (
            <EmptyState title="Aún no hay solicitudes" description="Cuando un estudiante pida ayuda aparecerá aquí." />
          ) : (
            <RequestList
              requests={requests.slice(0, RECENT_LIMIT)}
              showStudent
              getHref={(request) => PATHS.requestDetail(request.id)}
              onNavigate={navigate}
            />
          )}
        </section>

        <section aria-labelledby="top-tutors-title" className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 id="top-tutors-title" className="text-lg font-semibold text-slate-900">
              Tutores más asignados
            </h2>
            <TextLink as={Link} to={PATHS.coordinator.tutors} className="text-sm">
              Ver todos
            </TextLink>
          </div>
          <Card padding="none">
            <ol className="divide-y divide-slate-100">
              {topTutors.map((tutor) => (
                <li key={tutor.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <UserIdentity size="sm" name={tutor.user.name} detail={EXPERIENCE_LABELS[tutor.experienceLevel]} />
                  <span className="text-sm font-semibold tabular-nums text-slate-900">
                    {assignmentsByTutor[tutor.id] ?? 0}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </section>
      </div>
    </>
  );
}
