import { useCallback, useState } from 'react';
import { Card } from '@atoms/Card';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { TutorProfileForm } from '@organisms/TutorProfileForm';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAsyncData } from '@hooks/useAsyncData';
import { listSubjects } from '@services/subjectService';
import { tutorService } from '@services/tutorService';
import type { TutorProfileInput } from '@/types/domain';

const loadProfileData = async () => {
  const [subjects, profile] = await Promise.all([listSubjects(), tutorService.getMyProfile()]);
  return { subjects, profile };
};

export function TutorProfilePage() {
  const { data, isLoading, error, reload, setData } = useAsyncData(loadProfileData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const saveProfile = useCallback(
    async (input: TutorProfileInput) => {
      setSuccessMessage(null);
      const profile = await tutorService.updateMyProfile(input);
      if (data) setData({ ...data, profile });
      setSuccessMessage('Perfil guardado. Ya cuentas para las próximas recomendaciones.');
    },
    [data, setData],
  );
  const { run, isLoading: isSaving, error: saveError } = useAsyncAction(saveProfile);

  return (
    <>
      <PageHeader
        title="Mi perfil de tutor"
        description="Tus materias, horarios y modalidad se usan para calcular tu afinidad con cada estudiante."
      />
      <Card padding="lg">
        {data ? (
          <TutorProfileForm
            subjects={data.subjects}
            experienceLevel={data.profile.experienceLevel}
            initialValues={{
              subjectIds: data.profile.subjects.map((subject) => subject.id),
              modality: data.profile.modality,
              availability: data.profile.availability,
              bio: data.profile.bio,
            }}
            onSubmit={run}
            isLoading={isSaving}
            errorMessage={saveError}
            successMessage={successMessage}
          />
        ) : (
          <LoadState isLoading={isLoading} error={error} onRetry={reload} />
        )}
      </Card>
    </>
  );
}
