import type { AuthSession, LoginCredentials, RegisterData, User } from '@/types/auth';
import { http } from './http';
import { clearSession, getStoredSession, saveSession, updateStoredUser } from './session';

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const session = await http<AuthSession>('/auth/login', { method: 'POST', body: credentials });
  saveSession(session, credentials.rememberMe);
  return session;
}

export async function register(data: RegisterData): Promise<AuthSession> {
  const session = await http<AuthSession>('/auth/register', { method: 'POST', body: data });
  saveSession(session, true);
  return session;
}

/** Valida el token guardado y devuelve el usuario actual. Un 401 cierra la sesión (ver http.ts). */
export async function fetchCurrentUser(): Promise<User> {
  const { user } = await http<{ user: User }>('/auth/me');
  updateStoredUser(user);
  return user;
}

export function logout(): void {
  if (getStoredSession()) {
    // Opcional según la API: basta con borrar el token, así que no se espera la respuesta.
    http('/auth/logout', { method: 'POST' }).catch(() => undefined);
  }
  clearSession();
}

export { getStoredSession } from './session';
