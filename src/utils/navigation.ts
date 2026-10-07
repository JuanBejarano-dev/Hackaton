import type { MouseEvent } from 'react';

/**
 * Permite que un <a href> navegue con el router de la app sin acoplar el componente al router.
 * Respeta ctrl/cmd/shift + clic para abrir en otra pestaña.
 */
export function handleClientNavigation(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  onNavigate: (href: string) => void,
): void {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  onNavigate(href);
}
