# API de TutorMatch

- Swagger: https://hackaton-backend-1w19.onrender.com/swagger-ui.html
- Producción: `https://hackaton-backend-1w19.onrender.com/api` (`.env.production`)
- Desarrollo: `http://localhost:8080/api` (`.env.development`)

`npm run dev` usa el backend local; `npm run dev:prod-api` usa el de Render.
En Vercel, `VITE_API_URL` debe estar en Settings → Environment Variables (y redesplegar).

| Método | Ruta | Dónde se usa |
|---|---|---|
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | `src/services/authService.ts` |
| GET | `/auth/me` | Restaura la sesión al abrir la app (`src/context/AuthContext.tsx`) |
| GET / POST | `/tutores` | Pantallas Tutores y Registrar tutor (`src/services/tutorService.ts`) |
| GET | `/tutores/{id}` | `getTutor` en `src/services/tutorService.ts` |
| POST | `/match` | Pantalla Buscar tutor (`src/services/matchService.ts`) |
| GET | `/solicitudes`, `/solicitudes/{id}` | Historial de asignaciones (`src/services/solicitudService.ts`) |

Los tipos de cada respuesta están en `src/types/domain.ts` y `src/types/auth.ts`.
En tutores, `materias` y `horarios` viajan como texto separado por comas; la conversión está en `src/utils/tutores.ts`.
