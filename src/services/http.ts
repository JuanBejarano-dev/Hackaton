import { API_URL } from '@/config';
import { clearSession, getStoredSession, SESSION_EXPIRED_EVENT } from './session';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface HttpOptions {
  method?: HttpMethod;
  body?: unknown;
}

function extractMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message;
  }
  return `Error del servidor (${status})`;
}

/** Cliente HTTP para el backend: añade el token y normaliza los errores a ApiError. */
export async function http<T>(path: string, { method = 'GET', body }: HttpOptions = {}): Promise<T> {
  const token = getStoredSession()?.token;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw new ApiError(extractMessage(data, response.status), response.status);
  }

  return data as T;
}
