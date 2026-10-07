import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToggleChip } from '@atoms/ToggleChip';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { RequestList } from '@organisms/RequestList';
import { useAsyncData } from '@hooks/useAsyncData';
import { requestService } from '@services/requestService';
import type { RequestStatus } from '@/types/domain';
import { PATHS } from '@/routes/paths';

type StatusFilter = 'all' | RequestStatus;

const FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'assigned', label: 'Asignadas' },
  { value: 'no_match', label: 'Sin tutor' },
];

export function CoordinatorRequestsPage() {
  const navigate = useNavigate();
  const { data: requests, isLoading, error, reload } = useAsyncData(() => requestService.listRequests());
  const [filter, setFilter] = useState<StatusFilter>('all');

  const visible = requests?.filter((request) => filter === 'all' || request.status === filter) ?? [];

  return (
    <>
      <PageHeader
        title="Solicitudes"
        description="Todas las solicitudes con su tutor asignado. Abre una para ver el ranking completo o reasignar."
      />

      {!requests ? (
        <LoadState isLoading={isLoading} error={error} onRetry={reload} />
      ) : (
        <div className="space-y-4">
          <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
            {FILTERS.map((option) => (
              <ToggleChip key={option.value} selected={filter === option.value} onClick={() => setFilter(option.value)}>
                {option.label} ({option.value === 'all' ? requests.length : requests.filter((r) => r.status === option.value).length})
              </ToggleChip>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState title="No hay solicitudes con este filtro" />
          ) : (
            <RequestList
              requests={visible}
              showStudent
              getHref={(request) => PATHS.requestDetail(request.id)}
              onNavigate={navigate}
            />
          )}
        </div>
      )}
    </>
  );
}
