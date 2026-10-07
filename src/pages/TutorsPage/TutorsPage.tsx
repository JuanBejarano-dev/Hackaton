import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { Icon } from '@atoms/Icon';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { TutorTable } from '@organisms/TutorTable';
import { useAsyncData } from '@hooks/useAsyncData';
import { listTutores } from '@services/tutorService';
import { PATHS, type TutorsLocationState } from '@/routes/paths';

export function TutorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const createdTutorName = (location.state as TutorsLocationState | null)?.createdTutorName;
  const { data: tutores, isLoading, error, reload } = useAsyncData(listTutores);

  const newTutorButton = (
    <Button leftIcon={<Icon name="plus" className="h-4 w-4" />} onClick={() => navigate(PATHS.newTutor)}>
      Registrar tutor
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Tutores"
        description="Tutores registrados con sus materias, horarios, nivel y calificación."
        actions={newTutorButton}
      />

      <div className="space-y-4">
        {createdTutorName && <Alert variant="success">Se registró a {createdTutorName} correctamente.</Alert>}

        {!tutores ? (
          <LoadState isLoading={isLoading} error={error} onRetry={reload} loadingText="Cargando tutores…" />
        ) : tutores.length === 0 ? (
          <EmptyState icon="users" title="Aún no hay tutores registrados" action={newTutorButton} />
        ) : (
          <TutorTable tutores={tutores} />
        )}
      </div>
    </>
  );
}
