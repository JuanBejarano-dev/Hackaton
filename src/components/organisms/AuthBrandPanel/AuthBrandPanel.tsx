/** Contenido del panel lateral de marca que comparten las páginas de autenticación. */
export function AuthBrandPanel() {
  return (
    <>
      <span className="text-xl font-bold">Hackaton</span>
      <div className="max-w-md space-y-4">
        <h2 className="text-4xl font-bold leading-tight">Construye, itera y gana.</h2>
        <p className="text-lg text-brand-100">
          Accede a tu espacio de trabajo y sigue el avance de tu equipo en tiempo real.
        </p>
      </div>
      <p className="text-sm text-brand-100">© {new Date().getFullYear()} Hackaton</p>
    </>
  );
}
