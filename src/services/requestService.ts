import { USE_MOCK_API } from '@/config';
import type { TutoringRequest, TutoringRequestInput } from '@/types/domain';
import { ApiError, http } from './http';
import { buildRequest, readDb, requireCurrentUser, simulateLatency, writeDb } from './mock/db';

interface RequestApi {
  /**
   * Solicitudes visibles para el usuario actual (el backend filtra por rol):
   * estudiante → las suyas · tutor → las que tiene asignadas · coordinador → todas.
   */
  listRequests(): Promise<TutoringRequest[]>;
  getRequest(id: string): Promise<TutoringRequest>;
  /** Crea la solicitud; el backend calcula el ranking y asigna al mejor tutor. */
  createRequest(input: TutoringRequestInput): Promise<TutoringRequest>;
  /** El coordinador cambia el tutor asignado. */
  assignTutor(requestId: string, tutorId: string): Promise<TutoringRequest>;
}

const httpRequestApi: RequestApi = {
  listRequests: () => http<TutoringRequest[]>('/requests'),
  getRequest: (id) => http<TutoringRequest>(`/requests/${id}`),
  createRequest: (input) => http<TutoringRequest>('/requests', { method: 'POST', body: input }),
  assignTutor: (requestId, tutorId) =>
    http<TutoringRequest>(`/requests/${requestId}/assignment`, { method: 'PATCH', body: { tutorId } }),
};

const byNewest = (a: TutoringRequest, b: TutoringRequest) => b.createdAt.localeCompare(a.createdAt);

const mockRequestApi: RequestApi = {
  async listRequests() {
    await simulateLatency();
    const db = readDb();
    const user = requireCurrentUser(db);

    if (user.role === 'coordinator') return [...db.requests].sort(byNewest);
    if (user.role === 'student') {
      return db.requests.filter((request) => request.student.id === user.id).sort(byNewest);
    }
    const myTutorId = db.tutors.find((tutor) => tutor.userId === user.id)?.id;
    return db.requests.filter((request) => request.assignedTutorId === myTutorId).sort(byNewest);
  },

  async getRequest(id) {
    await simulateLatency();
    const request = readDb().requests.find((candidate) => candidate.id === id);
    if (!request) throw new ApiError('Solicitud no encontrada', 404);
    return request;
  },

  async createRequest(input) {
    await simulateLatency();
    const db = readDb();
    const user = requireCurrentUser(db);
    const request = buildRequest(db, user.id, input);
    db.requests.push(request);
    writeDb(db);
    return request;
  },

  async assignTutor(requestId, tutorId) {
    await simulateLatency();
    const db = readDb();
    const request = db.requests.find((candidate) => candidate.id === requestId);
    if (!request) throw new ApiError('Solicitud no encontrada', 404);
    if (!request.matches.some((match) => match.tutor.id === tutorId)) {
      throw new ApiError('Ese tutor no fue evaluado para esta solicitud', 400);
    }
    request.assignedTutorId = tutorId;
    request.status = 'assigned';
    writeDb(db);
    return request;
  },
};

export const requestService: RequestApi = USE_MOCK_API ? mockRequestApi : httpRequestApi;
