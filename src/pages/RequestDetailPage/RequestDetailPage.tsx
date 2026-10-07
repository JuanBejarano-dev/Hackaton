import { useCallback, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Alert } from '@atoms/Alert';
import { Badge } from '@atoms/Badge';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Icon } from '@atoms/Icon';
import { TextLink } from '@atoms/TextLink';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { UserIdentity } from '@molecules/UserIdentity';
import { AvailabilityGrid } from '@organisms/AvailabilityGrid';
import { MatchRanking } from '@organisms/MatchRanking';
import { RecommendationCard } from '@organisms/RecommendationCard';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAsyncData } from '@hooks/useAsyncData';
import { useAuth } from '@hooks/useAuth';
import { requestService } from '@services/requestService';
import type { Role } from '@/types/auth';
import { PATHS, type RequestDetailLocationState } from '@/routes/paths';
import { formatDate, MODALITY_PREFERENCE_LABELS, REQUEST_STATUS_LABELS } from '@utils/labels';
import { getAssignedMatch } from '@utils/requests';

const BACK_LINK: Record<Role, { href: string; label: string }> = {
  student: { href: PATHS.student.home, label: 'Mis solicitudes' },
  tutor: { href: PATHS.tutor.home, label: 'Mis tutorías' },
  coordinator: { href: PATHS.coordinator.requests, label: 'Solicitudes' },
};

export function RequestDetailPage() {
  const { requestId = '' } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const justCreated = (location.state as RequestDetailLocationState | null)?.justCreated ?? false;

  const {
    data: request,
    isLoading,
    error,
    reload,
    setData,
  } = useAsyncData(() => requestService.getRequest(requestId), [requestId]);

  const [assigningTutorId, setAssigningTutorId] = useState<string | null>(null);
  const assignTutor = useCallback(
    async (tutorId: string) => {
      setAssigningTutorId(tutorId);
      try {
        setData(await requestService.assignTutor(requestId, tutorId));
      } finally {
        setAssigningTutorId(null);
      }
    },
    [requestId, setData],
  );
  const { run: runAssign, error: assignError } = useAsyncAction(assignTutor);

  if (!user) return null;
  const role = user.role;
  const back = BACK_LINK[role];

  const eyebrow = (
    <TextLink as={Link} to={back.href} className="inline-flex items-center gap-1 text-sm">
      <Icon name="arrowLeft" className="h-4 w-4" />
      {back.label}
    </TextLink>
  );

  if (!request) {
    return (
      <>
        <PageHeader eyebrow={eyebrow} title="Detalle de la solicitud" />
        <LoadState isLoading={isLoading} error={error} onRetry={reload} loadingText="Cargando solicitud…" />
      </>
    );
  }

  const match = getAssignedMatch(request);
  const hasAssignment = Boolean(request.assignedTutorId && match);
  const cardTitle =
    role === 'tutor' ? 'Tu asignación' : hasAssignment ? 'Tutor asignado' : 'Mejor opción encontrada';

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={request.subject.name}
        description={`Solicitud de ${request.student.name} · ${formatDate(request.createdAt)}`}
        actions={
          <Badge tone={request.status === 'assigned' ? 'success' : request.status === 'pending' ? 'warning' : 'danger'}>
            {REQUEST_STATUS_LABELS[request.status]}
          </Badge>
        }
      />

      <div className="space-y-6">
        {justCreated && hasAssignment && (
          <Alert variant="success">
            <strong>¡Listo!</strong> Comparamos tu solicitud con {request.matches.length} tutores y este es el más
            afín para ti.
          </Alert>
        )}
        {assignError && <Alert variant="error">{assignError}</Alert>}

        {match ? (
          <RecommendationCard match={match} title={cardTitle} />
        ) : (
          <EmptyState
            icon="alert"
            title="No encontramos un tutor para esta solicitud"
            description="Ningún tutor registrado domina esta materia todavía. La coordinación revisará tu caso."
          />
        )}

        {match && !hasAssignment && (
          <Alert variant="info">
            Ningún tutor coincide con tus bloques de horario. Esta es la opción más cercana; prueba agregando más
            bloques en una nueva solicitud.
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card as="section" aria-label="Horario del estudiante">
            <AvailabilityGrid
              label={role === 'student' ? 'Tu horario' : 'Horario del estudiante'}
              value={request.availability}
              highlight={match?.matchingBlocks}
            />
          </Card>

          <Card as="section" aria-label="Detalles de la solicitud" className="space-y-4">
            {role !== 'student' && <UserIdentity name={request.student.name} detail={request.student.email} />}
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Modalidad preferida</dt>
                <dd className="mt-0.5 text-slate-900">{MODALITY_PREFERENCE_LABELS[request.modality]}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detalles</dt>
                <dd className="mt-0.5 whitespace-pre-line text-slate-900">{request.notes || 'Sin comentarios'}</dd>
              </div>
            </dl>
          </Card>
        </div>

        {role !== 'tutor' && request.matches.length > 1 && (
          <MatchRanking
            matches={request.matches}
            requestedBlocks={request.availability.length}
            assignedTutorId={request.assignedTutorId}
            renderAction={
              role === 'coordinator'
                ? (candidate) =>
                    candidate.tutor.id === request.assignedTutorId ? null : (
                      <Button
                        size="sm"
                        variant="secondary"
                        isLoading={assigningTutorId === candidate.tutor.id}
                        disabled={assigningTutorId !== null}
                        onClick={() => runAssign(candidate.tutor.id)}
                      >
                        Asignar
                      </Button>
                    )
                : undefined
            }
          />
        )}
      </div>
    </>
  );
}
