import { API_URL, REQUEST_TIMEOUT_MS } from '@/config';
import { trackRequest } from './serverStatus';
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

const UNEXPECTED_ERROR = 'Ocurrió un error inesperado';

function extractMessage(data: unknown): string {
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' && data.message) {
    return data.message;
  }
  return UNEXPECTED_ERROR;
}

async function request<T>(path: string, { method = 'GET', body }: HttpOptions): Promise<T> {
  const token = getStoredSession()?.token;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError';
    throw new ApiError(
      timedOut
        ? 'El servidor tardó demasiado en responder. Intenta de nuevo en unos segundos.'
        : 'No se pudo conectar con el servidor',
      0,
    );
  } finally {
    clearTimeout(timeout);
  }

  // Tolera 204 y cuerpos vacíos o que no sean JSON.
  const text = await response.text().catch(() => '');
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    // 401 en una ruta protegida (con token): se cierra la sesión y la app redirige al login.
    if (response.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw new ApiError(extractMessage(data), response.status);
  }

  return data as T;
}

/** Cliente HTTP central: URL base, token, timeout de 60 s y errores normalizados a ApiError. */
export function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  return trackRequest(request<T>(path, options));
}
