import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Alert } from '@atoms/Alert';
import { AppHeader } from '@organisms/AppHeader';
import { DashboardLayout } from '@templates/DashboardLayout';
import { useAuth } from '@hooks/useAuth';
import { getTutores, materiasArray, horariosArray, nivelLabel, type Tutor } from '@services/tutorService';
import { buscarTutor, type MatchResult } from '@services/matchService';

const SUBJECTS = ['Calculo', 'Fisica', 'Programacion', 'Bases de Datos', 'Estadistica', 'Ingles'];
const SLOTS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'].flatMap((day) => ['08', '10', '14', '16'].map((hour) => `${day}-${hour}`));
const MODES = ['PRESENCIAL', 'VIRTUAL', 'AMBAS'] as const;

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [mode, setMode] = useState<(typeof MODES)[number]>('VIRTUAL');
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);

  const loadTutors = useCallback(async () => {
    try { setTutors(await getTutores()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadTutors(); }, [loadTutors]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setSearching(true); setError(null); setResults(null); setSlow(false);
    const wakeTimer = window.setTimeout(() => setSlow(true), 5000);
    try {
      setResults(await buscarTutor({ nombreEstudiante: user?.name ?? '', materia: subject, horarios: slots, modalidad: mode }));
    } catch (e) { setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado'); }
    finally { window.clearTimeout(wakeTimer); setSearching(false); }
  }

  if (!user) return null;
  return <DashboardLayout header={<AppHeader brandName="TutorMatch" userName={user.name} onLogout={logout} />}>
    <h1 className="text-2xl font-bold text-slate-900">Hola, {user.name.split(' ')[0]} 👋</h1>
    <p className="mt-1 text-slate-600">Encuentra el tutor ideal para tu próxima sesión.</p>
    {error && <div className="mt-5"><Alert variant="error">{error}</Alert></div>}
    {slow && searching && <div className="mt-4"><Alert variant="info">Despertando el servidor, puede tardar unos segundos…</Alert></div>}
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Buscar tutor</h2>
      <label className="block text-sm font-medium">Materia<select className="mt-1 block w-full rounded-lg border border-slate-300 p-2" value={subject} onChange={(e) => setSubject(e.target.value)}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select></label>
      <fieldset><legend className="text-sm font-medium">Horarios disponibles</legend><div className="mt-2 flex flex-wrap gap-3">{SLOTS.map((slot) => <label key={slot} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={slots.includes(slot)} onChange={(e) => setSlots(e.target.checked ? [...slots, slot] : slots.filter((value) => value !== slot))} />{slot}</label>)}</div></fieldset>
      <label className="block text-sm font-medium">Modalidad<select className="mt-1 block w-full rounded-lg border border-slate-300 p-2" value={mode} onChange={(e) => setMode(e.target.value as (typeof MODES)[number])}>{MODES.map((item) => <option key={item}>{item}</option>)}</select></label>
      <button disabled={searching} className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white disabled:opacity-60">{searching ? 'Buscando…' : 'Buscar tutor compatible'}</button>
    </form>
    {results && <section className="mt-6 space-y-4"><h2 className="text-lg font-semibold">Resultados</h2>{!results.length ? <Alert variant="info">No hay tutores disponibles para esa materia</Alert> : results.map((match, index) => <article key={match.tutorId} className={`rounded-xl border bg-white p-5 ${match.recomendado && index === 0 ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
      {match.recomendado && index === 0 && <div className="mb-2 text-sm font-semibold text-indigo-700">Tutor recomendado</div>}
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{match.nombreTutor}</h3><span className="text-xl font-bold text-indigo-700">{match.score}/100</span></div>
      <p className="mt-2 text-slate-700">{match.justificacion}</p><p className="mt-2 text-sm text-slate-600">Horarios coincidentes: {match.horariosCoincidentes.join(', ') || '—'}</p>
      <div className="mt-4 space-y-3">{match.desglose.map((criterion) => { const maximum = criterion.peso * 100; const width = maximum > 0 ? Math.min(100, criterion.aporte / maximum * 100) : 0; return <div key={criterion.nombreCriterio}><div className="flex justify-between text-sm"><span>{criterion.nombreCriterio}</span><span>{criterion.aporte.toFixed(1)} / {maximum}</span></div><div className="mt-1 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-indigo-500" style={{ width: `${width}%` }} /></div><p className="text-xs text-slate-500">{criterion.explicacion}</p></div>; })}</div>
    </article>)}</section>}
    <section className="mt-8"><h2 className="text-lg font-semibold">Tutores disponibles</h2>{loading ? <p className="mt-2 text-slate-600">Cargando tutores…</p> : tutors.length === 0 ? <p className="mt-2 text-slate-600">No hay tutores registrados.</p> : <div className="mt-3 grid gap-3 sm:grid-cols-2">{tutors.map((tutor) => <article key={tutor.id} className="rounded-xl border border-slate-200 bg-white p-4"><h3 className="font-semibold">{tutor.nombre} <span className="text-sm font-normal text-slate-500">· {nivelLabel(tutor.nivel)}</span></h3><p className="mt-1 text-sm">Materias: {materiasArray(tutor.materias).join(', ')}</p><p className="text-sm">Horarios: {horariosArray(tutor.horarios).join(', ')}</p><p className="text-sm">{tutor.modalidad} · ★ {tutor.calificacion}</p></article>)}</div>}</section>
  </DashboardLayout>;
}
