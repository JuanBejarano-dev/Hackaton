import { useNavigate } from 'react-router-dom';
import { Button } from '@atoms/Button';
import { Icon } from '@atoms/Icon';
import { EmptyState } from '@molecules/EmptyState';
import { LoadState } from '@molecules/LoadState';
import { PageHeader } from '@molecules/PageHeader';
import { RequestList } from '@organisms/RequestList';
import { useAsyncData } from '@hooks/useAsyncData';
import { useAuth } from '@hooks/useAuth';
import { requestService } from '@services/requestService';
import { PATHS } from '@/routes/paths';

export function StudentHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: requests, isLoading, error, reload } = useAsyncData(() => requestService.listRequests());

  const newRequestButton = (
    <Button leftIcon={<Icon name="plus" className="h-4 w-4" />} onClick={() => navigate(PATHS.student.newRequest)}>
      Nueva solicitud
    </Button>
  );

  return (
    <>
      <PageHeader
        title={`Hola, ${user?.name.split(' ')[0] ?? ''}`}
        description="Aquí están tus solicitudes de tutoría y el tutor que te recomendamos en cada una."
        actions={newRequestButton}
      />

      {!requests ? (
        <LoadState isLoading={isLoading} error={error} onRetry={reload} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon="sparkles"
          title="Aún no has pedido ninguna tutoría"
          description="Cuéntanos qué materia necesitas y cuándo puedes; te recomendamos al tutor ideal al instante."
          action={newRequestButton}
        />
      ) : (
        <RequestList
          requests={requests}
          getHref={(request) => PATHS.requestDetail(request.id)}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
