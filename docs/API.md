# Contrato de API — TutorMatch

Configura la URL en `.env.local`: `VITE_API_URL=http://localhost:3000/api`.
Sin esa variable, el frontend usa datos simulados.

- Todas las rutas (menos login/registro) reciben `Authorization: Bearer <token>`.
- Errores: `{ "message": "texto para el usuario" }` con el código HTTP correspondiente (401 cierra la sesión).
- Bloques de horario: `{ "day": "monday".."saturday", "slot": "07-09" | "09-11" | "11-13" | "14-16" | "16-18" | "18-20" }`.

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password, rememberMe }` | `{ user, token }` |
| POST | `/auth/register` | `{ name, email, password, role: "student" \| "tutor" }` | `{ user, token }` |
| GET | `/subjects` | — | `Subject[]` |
| GET | `/tutors/me` | — | `TutorProfile` |
| PUT | `/tutors/me` | `{ subjectIds, availability, modality, bio }` | `TutorProfile` |
| GET | `/tutors` | — (coordinador) | `TutorProfile[]` |
| PATCH | `/tutors/:id` | `{ experienceLevel }` (coordinador) | `TutorProfile` |
| GET | `/requests` | — (filtra por rol del token) | `TutoringRequest[]` |
| GET | `/requests/:id` | — | `TutoringRequest` |
| POST | `/requests` | `{ subjectId, availability, modality, notes }` | `TutoringRequest` con score calculado |
| PATCH | `/requests/:id/assignment` | `{ tutorId }` (coordinador) | `TutoringRequest` |

## Tipos

```ts
User            { id, name, email, role: "student" | "tutor" | "coordinator" }
Subject         { id, name }
TutorProfile    { id, user: { id, name, email }, subjects: Subject[], availability: TimeBlock[],
                  experienceLevel: "junior" | "intermediate" | "senior",
                  modality: "virtual" | "in_person" | "both", bio }
TutoringRequest { id, student: { id, name, email }, subject: Subject, availability: TimeBlock[],
                  modality: "virtual" | "in_person" | "any", notes,
                  status: "pending" | "assigned" | "no_match", createdAt (ISO),
                  assignedTutorId: string | null,          // id de TutorProfile
                  matches: MatchResult[] }                 // ordenado de mayor a menor score
MatchResult     { tutor: { id, name, email, experienceLevel, modality },  // id = TutorProfile.id
                  score: 0-100, justification: string, matchingBlocks: TimeBlock[],
                  criteria: { key, label, score: 0-100, weight: 0-1 }[] }
```

Los tipos completos están en `src/types/`. Las llamadas, en `src/services/` (`httpXxxApi` en cada archivo).
