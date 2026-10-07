export const APP_NAME = 'TutorMatch';

/** URL base del backend; se define en .env.development / .env.production (y en Vercel). */
export const API_URL: string = import.meta.env.VITE_API_URL ?? '';

if (!API_URL) {
  throw new Error('Falta la variable de entorno VITE_API_URL (revisa .env.development o .env.production).');
}

/** El backend está en el plan gratis de Render y puede tardar ~50 s en despertar. */
export const REQUEST_TIMEOUT_MS = 60_000;

/** Tras este tiempo se avisa que el servidor está despertando. */
export const SLOW_REQUEST_MS = 5_000;
