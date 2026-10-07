import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@atoms/Card';
import { Icon } from '@atoms/Icon';
import { TextLink } from '@atoms/TextLink';
import { PageHeader } from '@molecules/PageHeader';
import { TutorForm } from '@organisms/TutorForm';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { createTutor } from '@services/tutorService';
import type { TutorInput } from '@/types/domain';
import { PATHS, type TutorsLocationState } from '@/routes/paths';

export function NewTutorPage() {
  const navigate = useNavigate();

  const saveTutor = useCallback(
    async (input: TutorInput) => {
      const tutor = await createTutor(input);
      navigate(PATHS.tutors, { state: { createdTutorName: tutor.nombre } satisfies TutorsLocationState });
    },
    [navigate],
  );
  const { run, isLoading, error } = useAsyncAction(saveTutor);

  return (
    <>
      <PageHeader
        eyebrow={
          <TextLink as={Link} to={PATHS.tutors} className="inline-flex items-center gap-1 text-sm">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Tutores
          </TextLink>
        }
        title="Registrar tutor"
        description="Sus materias, horarios, nivel y calificación se usan para calcular la afinidad con cada estudiante."
      />
      <Card padding="lg">
        <TutorForm onSubmit={run} isLoading={isLoading} errorMessage={error} />
      </Card>
    </>
  );
}
