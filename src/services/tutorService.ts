import { apiRequest } from './apiClient';

export interface Tutor {
  id: number; nombre: string; materias: string; horarios: string;
  nivel: 1 | 2 | 3; calificacion: number; modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'AMBAS';
}
export interface TutorData extends Omit<Tutor, 'id'> {}
export const materiasArray = (value: string): string[] => value.split(',').map((item) => item.trim()).filter(Boolean);
export const horariosArray = (value: string): string[] => value.split(',').map((item) => item.trim()).filter(Boolean);
export const materiasString = (value: string[]): string => value.join(',');
export const horariosString = (value: string[]): string => value.join(',');
export const nivelLabel = (nivel: Tutor['nivel']): string => ({ 1: 'Básico', 2: 'Intermedio', 3: 'Experto' })[nivel];
export const getTutores = (): Promise<Tutor[]> => apiRequest('/tutores', { protected: true });
export const getTutor = (id: number): Promise<Tutor> => apiRequest(`/tutores/${id}`, { protected: true });
export const crearTutor = (data: TutorData): Promise<Tutor> => apiRequest('/tutores', {
  method: 'POST', body: JSON.stringify(data), protected: true,
});
