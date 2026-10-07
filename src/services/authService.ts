import { USE_MOCK_API } from '@/config';
import type { AuthSession, LoginCredentials, RegisterData } from '@/types/auth';
import { ApiError, http } from './http';
import { readDb, simulateLatency, toPublicUser, writeDb } from './mock/db';
import { clearSession, saveSession } from './session';

interface AuthApi {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(data: RegisterData): Promise<AuthSession>;
}

const httpAuthApi: AuthApi = {
  login: (credentials) => http<AuthSession>('/auth/login', { method: 'POST', body: credentials }),
  register: (data) => http<AuthSession>('/auth/register', { method: 'POST', body: data }),
};

const mockAuthApi: AuthApi = {
  async login({ email, password }) {
    await simulateLatency();
    const db = readDb();
    const user = db.users.find((candidate) => candidate.email === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      throw new ApiError('Correo o contraseña incorrectos', 401);
    }
    return { user: toPublicUser(user), token: crypto.randomUUID() };
  },

  async register({ name, email, password, role }) {
    await simulateLatency();
    const db = readDb();
    const normalizedEmail = email.trim().toLowerCase();
    if (db.users.some((candidate) => candidate.email === normalizedEmail)) {
      throw new ApiError('Ya existe una cuenta con ese correo', 409);
    }

    const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, role, password };
    db.users.push(user);
    if (role === 'tutor') {
      db.tutors.push({
        id: crypto.randomUUID(),
        userId: user.id,
        subjectIds: [],
        availability: [],
        experienceLevel: 'junior',
        modality: 'both',
        bio: '',
      });
    }
    writeDb(db);
    return { user: toPublicUser(user), token: crypto.randomUUID() };
  },
};

const api = USE_MOCK_API ? mockAuthApi : httpAuthApi;

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const session = await api.login(credentials);
  saveSession(session, credentials.rememberMe);
  return session;
}

export async function register(data: RegisterData): Promise<AuthSession> {
  const session = await api.register(data);
  saveSession(session, true);
  return session;
}

export function logout(): void {
  clearSession();
}

export { getStoredSession } from './session';
