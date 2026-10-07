export const APP_NAME = 'TutorMatch';

/** URL base del backend. Si no está definida, la app funciona con datos simulados (mock). */
export const API_URL: string | undefined = import.meta.env.VITE_API_URL || undefined;

export const USE_MOCK_API = !API_URL;
