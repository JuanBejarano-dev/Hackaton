import type { AuthSession, User } from '@/types/auth';

const SESSION_KEY = 'tutormatch.session';

/** Evento que se emite cuando el backend rechaza el token (401). */
export const SESSION_EXPIRED_EVENT = 'tutormatch:session-expired';

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

/** `persistent` = true guarda en localStorage ("Recordarme"); si no, en sessionStorage. */
export function saveSession(session: AuthSession, persistent: boolean): void {
  clearSession();
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

/** Actualiza el usuario guardado sin cambiar dónde está el token. */
export function updateStoredUser(user: User): void {
  const storage = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage;
  const session = getStoredSession();
  if (session) storage.setItem(SESSION_KEY, JSON.stringify({ ...session, user }));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
