import { useCallback, useMemo, useState } from 'react';
import { Alert } from '@atoms/Alert';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { TutorTable } from '@organisms/TutorTable';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAsyncData } from '@hooks/useAsyncData';
import { requestService } from '@services/requestService';
import { tutorService } from '@services/tutorService';
import type { ExperienceLevel } from '@/types/domain';

const loadTutors = async () => {
  const [tutors, requests] = await Promise.all([tutorService.listTutors(), requestService.listRequests()]);
  return { tutors, requests };
};

export function CoordinatorTutorsPage() {
  const { data, isLoading, error, reload, setData } = useAsyncData(loadTutors);
  const [updatingTutorId, setUpdatingTutorId] = useState<string | null>(null);

  const assignmentCounts = useMemo(
    () =>
      (data?.requests ?? []).reduce<Record<string, number>>((counts, request) => {
        if (request.assignedTutorId) counts[request.assignedTutorId] = (counts[request.assignedTutorId] ?? 0) + 1;
        return counts;
      }, {}),
    [data],
  );

  const changeLevel = useCallback(
    async (tutorId: string, level: ExperienceLevel) => {
      if (!data) return;
      setUpdatingTutorId(tutorId);
      try {
        const updated = await tutorService.updateExperienceLevel(tutorId, level);
        setData({ ...data, tutors: data.tutors.map((tutor) => (tutor.id === updated.id ? updated : tutor)) });
      } finally {
        setUpdatingTutorId(null);
      }
    },
    [data, setData],
  );
  const { run, error: updateError } = useAsyncAction(changeLevel);

  return (
    <>
      <PageHeader
        title="Tutores"
        description="Ajusta el nivel de cada tutor: los de más experiencia tienen mayor peso en el score de afinidad."
      />

      {!data ? (
        <LoadState isLoading={isLoading} error={error} onRetry={reload} />
      ) : data.tutors.length === 0 ? (
        <EmptyState icon="users" title="No hay tutores registrados" />
      ) : (
        <div className="space-y-4">
          {updateError && <Alert variant="error">{updateError}</Alert>}
          <TutorTable
            tutors={data.tutors}
            assignmentCounts={assignmentCounts}
            onLevelChange={run}
            updatingTutorId={updatingTutorId}
          />
        </div>
      )}
    </>
  );
}
