import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@atoms/Card';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { RequestForm } from '@organisms/RequestForm';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAsyncData } from '@hooks/useAsyncData';
import { requestService } from '@services/requestService';
import { listSubjects } from '@services/subjectService';
import type { TutoringRequestInput } from '@/types/domain';
import { PATHS, type RequestDetailLocationState } from '@/routes/paths';

export function NewRequestPage() {
  const navigate = useNavigate();
  const { data: subjects, isLoading, error, reload } = useAsyncData(listSubjects);

  const createRequest = useCallback(
    async (input: TutoringRequestInput) => {
      const request = await requestService.createRequest(input);
      navigate(PATHS.requestDetail(request.id), {
        state: { justCreated: true } satisfies RequestDetailLocationState,
      });
    },
    [navigate],
  );
  const { run, isLoading: isSubmitting, error: submitError } = useAsyncAction(createRequest);

  return (
    <>
      <PageHeader
        title="Nueva solicitud de tutoría"
        description="Compararemos tu solicitud con todos los tutores disponibles y te recomendaremos al más afín."
      />
      <Card padding="lg">
        {subjects ? (
          <RequestForm subjects={subjects} onSubmit={run} isLoading={isSubmitting} errorMessage={submitError} />
        ) : (
          <LoadState isLoading={isLoading} error={error} onRetry={reload} />
        )}
      </Card>
    </>
  );
}
