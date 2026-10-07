import { useState } from 'react';
import { ToggleChip } from '@atoms/ToggleChip';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { StatCard } from '@molecules/StatCard';
import { HistoryTable } from '@organisms/HistoryTable';
import { useAsyncData } from '@hooks/useAsyncData';
import { listSolicitudes } from '@services/solicitudService';
import type { SolicitudRegistrada } from '@/types/domain';
import { formatScore } from '@utils/labels';

type Filter = 'all' | 'assigned' | 'unassigned';

const FILTERS: Array<{ value: Filter; label: string; matches: (s: SolicitudRegistrada) => boolean }> = [
  { value: 'all', label: 'Todas', matches: () => true },
  { value: 'assigned', label: 'Asignadas', matches: (s) => s.asignada },
  { value: 'unassigned', label: 'Sin asignar', matches: (s) => !s.asignada },
];

export function HistoryPage() {
  const { data: solicitudes, isLoading, error, reload } = useAsyncData(listSolicitudes);
  const [filter, setFilter] = useState<Filter>('all');

  const header = (
    <PageHeader
      title="Historial de asignaciones"
      description="Cada búsqueda queda registrada con el tutor asignado, su score y la justificación."
    />
  );

  if (!solicitudes) {
    return (
      <>
        {header}
        <LoadState isLoading={isLoading} error={error} onRetry={reload} loadingText="Cargando historial…" />
      </>
    );
  }

  const asignadas = solicitudes.filter((solicitud) => solicitud.asignada);
  const scores = asignadas.map((solicitud) => solicitud.score).filter((score): score is number => score !== null);
  const averageScore = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
  const activeFilter = FILTERS.find((option) => option.value === filter) ?? FILTERS[0];
  const visible = solicitudes.filter(activeFilter.matches);

  return (
    <>
      {header}

      {solicitudes.length === 0 ? (
        <EmptyState
          title="Aún no hay solicitudes registradas"
          description="Cada búsqueda en “Buscar tutor” aparecerá aquí automáticamente."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon="clipboard" label="Solicitudes" value={solicitudes.length} />
            <StatCard
              icon="check"
              label="Asignadas"
              value={asignadas.length}
              hint={`${solicitudes.length - asignadas.length} sin asignar`}
            />
            <StatCard
              icon="star"
              label="Score promedio"
              value={averageScore === null ? '—' : `${formatScore(averageScore)}/100`}
            />
          </div>

          <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
            {FILTERS.map((option) => (
              <ToggleChip key={option.value} selected={filter === option.value} onClick={() => setFilter(option.value)}>
                {option.label} ({solicitudes.filter(option.matches).length})
              </ToggleChip>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState title="No hay solicitudes con este filtro" />
          ) : (
            <HistoryTable solicitudes={visible} />
          )}
        </div>
      )}
    </>
  );
}
