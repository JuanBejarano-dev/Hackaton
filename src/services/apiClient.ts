const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'tutormatch.token';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string, rememberMe = true): void {
  clearToken();
  (rememberMe ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit { protected?: boolean }

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_URL) throw new ApiError('La URL de la API no está configurada', 0);
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 60_000);
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  try {
    const response = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
      ...options, headers, signal: controller.signal,
    });
    if (response.status === 401 && options.protected) {
      clearToken();
      window.location.assign('/login');
    }
    if (!response.ok) {
      let message = 'Ocurrió un error inesperado';
      try {
        const body = await response.json() as { message?: unknown };
        if (typeof body.message === 'string') message = body.message;
      } catch { /* Respuesta sin JSON */ }
      throw new ApiError(message, response.status);
    }
    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof DOMException && error.name === 'AbortError'
      ? 'La solicitud tardó demasiado. Intenta de nuevo.' : 'No se pudo conectar con el servidor', 0);
  } finally {
    window.clearTimeout(timer);
  }
}
