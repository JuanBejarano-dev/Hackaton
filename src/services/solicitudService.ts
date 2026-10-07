import type { SolicitudRegistrada } from '@/types/domain';
import { http } from './http';

/** Historial de búsquedas registradas por POST /match (más recientes primero). */
export const listSolicitudes = (): Promise<SolicitudRegistrada[]> => http<SolicitudRegistrada[]>('/solicitudes');

export const getSolicitud = (id: number): Promise<SolicitudRegistrada> =>
  http<SolicitudRegistrada>(`/solicitudes/${id}`);
