import type { MatchResult, SolicitudMatch } from '@/types/domain';
import { http } from './http';

type MatchResponse = Omit<MatchResult, 'disponible'> & { disponible?: boolean };

/** Busca el tutor ideal. La API devuelve primero los disponibles y luego por score. */
export async function buscarTutor(solicitud: SolicitudMatch): Promise<MatchResult[]> {
  const results = await http<MatchResponse[]>('/match', { method: 'POST', body: solicitud });
  return results.map((result) => ({
    ...result,
    // Si la versión desplegada del backend aún no envía `disponible`, se deduce de los horarios en común.
    disponible: result.disponible ?? result.horariosCoincidentes.length > 0,
  }));
}
