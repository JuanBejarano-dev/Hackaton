import { apiRequest } from './apiClient';

export interface DetalleCriterio { nombreCriterio: string; peso: number; puntaje: number; aporte: number; explicacion: string }
export interface MatchResult {
  tutorId: number; nombreTutor: string; score: number; justificacion: string;
  horariosCoincidentes: string[]; recomendado: boolean; desglose: DetalleCriterio[];
}
export interface MatchRequest { nombreEstudiante: string; materia: string; horarios: string[]; modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'AMBAS' }
export const buscarTutor = (solicitud: MatchRequest): Promise<MatchResult[]> => apiRequest('/match', {
  method: 'POST', body: JSON.stringify(solicitud), protected: true,
});
