import { Badge, type BadgeTone } from '@atoms/Badge';
import { Card } from '@atoms/Card';
import { Icon } from '@atoms/Icon';
import { ProgressBar } from '@atoms/ProgressBar';
import type { RequestStatus, TutoringRequest } from '@/types/domain';
import { formatDate, REQUEST_STATUS_LABELS } from '@utils/labels';
import { handleClientNavigation } from '@utils/navigation';
import { getAssignedMatch } from '@utils/requests';

export interface RequestListProps {
  requests: TutoringRequest[];
  /** Muestra el nombre del estudiante (vistas de tutor y coordinador). */
  showStudent?: boolean;
  getHref: (request: TutoringRequest) => string;
  onNavigate: (href: string) => void;
}

const STATUS_TONES: Record<RequestStatus, BadgeTone> = {
  pending: 'warning',
  assigned: 'success',
  no_match: 'danger',
};

export function RequestList({ requests, showStudent = false, getHref, onNavigate }: RequestListProps) {
  return (
    <ul className="space-y-3">
      {requests.map((request) => {
        const href = getHref(request);
        const match = getAssignedMatch(request);
        const tutorName = request.assignedTutorId ? match?.tutor.name : undefined;

        return (
          <Card
            as="li"
            key={request.id}
            className="relative transition-shadow focus-within:ring-2 focus-within:ring-brand-500 hover:shadow-md"
          >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {/* El ::after hace que toda la tarjeta sea clicable sin anidar elementos interactivos. */}
                  <a
                    href={href}
                    onClick={(event) => handleClientNavigation(event, href, onNavigate)}
                    className="font-semibold text-slate-900 after:absolute after:inset-0 after:rounded-2xl focus:outline-none"
                  >
                    {request.subject.name}
                  </a>
                  <Badge tone={STATUS_TONES[request.status]}>{REQUEST_STATUS_LABELS[request.status]}</Badge>
                </div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  {showStudent && (
                    <span className="flex items-center gap-1">
                      <Icon name="user" className="h-3.5 w-3.5" />
                      {request.student.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Icon name="calendar" className="h-3.5 w-3.5" />
                    {formatDate(request.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="clock" className="h-3.5 w-3.5" />
                    {request.availability.length} bloques
                  </span>
                </p>
              </div>

              <div className="text-sm">
                {tutorName && match ? (
                  <>
                    <p className="truncate text-slate-700">
                      Tutor: <span className="font-medium text-slate-900">{tutorName}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <ProgressBar value={match.score} label={`Score ${Math.round(match.score)}`} size="sm" />
                      <span className="font-semibold tabular-nums text-slate-900">{Math.round(match.score)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500">Sin tutor asignado</p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </ul>
  );
}
