import { Spinner } from '@atoms/Spinner';

export interface ServerWakeNoticeProps {
  visible: boolean;
}

/** Aviso flotante cuando el servidor tarda en responder (está despertando). */
export function ServerWakeNotice({ visible }: ServerWakeNoticeProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
    >
      <Spinner size="sm" className="shrink-0 text-brand-100" label="Esperando al servidor" />
      Despertando el servidor, puede tardar unos segundos…
    </div>
  );
}
