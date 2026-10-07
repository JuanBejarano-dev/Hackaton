import { useCallback, useState } from 'react';
import { Alert } from '@atoms/Alert';
import { Card } from '@atoms/Card';
import { EmptyState } from '@molecules/EmptyState';
import { PageHeader } from '@molecules/PageHeader';
import { MatchRanking } from '@organisms/MatchRanking';
import { RecommendationCard } from '@organisms/RecommendationCard';
import { RequestForm } from '@organisms/RequestForm';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { buscarTutor } from '@services/matchService';
import type { MatchResult, SolicitudMatch } from '@/types/domain';

interface SearchResult {
  solicitud: SolicitudMatch;
  matches: MatchResult[];
}

export function MatchPage() {
  const [result, setResult] = useState<SearchResult | null>(null);

  const search = useCallback(async (solicitud: SolicitudMatch) => {
    setResult(null);
    setResult({ solicitud, matches: await buscarTutor(solicitud) });
  }, []);
  const { run, isLoading, error } = useAsyncAction(search);

  const recomendado = result?.matches.find((match) => match.recomendado);

  return (
    <>
      <PageHeader
        title="Buscar el tutor ideal"
        description="Comparamos la solicitud con todos los tutores y recomendamos al más afín según horario, nivel, calificación y modalidad."
      />

      <div className="space-y-6">
        <Card padding="lg">
          <RequestForm onSubmit={run} isLoading={isLoading} errorMessage={error} />
        </Card>

        {result && (
          <section aria-label="Resultados de la búsqueda" className="space-y-6">
            {result.matches.length === 0 ? (
              <EmptyState
                icon="alert"
                title="No hay tutores que dominen esa materia"
                description={`Ningún tutor registrado enseña ${result.solicitud.materia}.`}
              />
            ) : (
              <>
                {recomendado ? (
                  <RecommendationCard
                    match={recomendado}
                    tutorDetail={`Recomendado para ${result.solicitud.nombreEstudiante}`}
                  />
                ) : (
                  <Alert variant="info">
                    Hay tutores para esa materia, pero ninguno disponible en esos horarios.
                  </Alert>
                )}
                <MatchRanking matches={result.matches} requestedHorarios={result.solicitud.horarios.length} />
              </>
            )}
          </section>
        )}
      </div>
    </>
  );
}
