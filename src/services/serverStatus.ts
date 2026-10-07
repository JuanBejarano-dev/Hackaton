import { SLOW_REQUEST_MS } from '@/config';

/*
 * Lleva la cuenta de peticiones que tardan más de SLOW_REQUEST_MS,
 * para avisar que el servidor (Render, plan gratis) está despertando.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let slowRequests = 0;

const emit = () => listeners.forEach((listener) => listener());

export function trackRequest<T>(request: Promise<T>): Promise<T> {
  let isSlow = false;
  const timer = setTimeout(() => {
    isSlow = true;
    slowRequests += 1;
    emit();
  }, SLOW_REQUEST_MS);

  return request.finally(() => {
    clearTimeout(timer);
    if (isSlow) {
      slowRequests -= 1;
      emit();
    }
  });
}

export function subscribeServerWaking(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const isServerWaking = (): boolean => slowRequests > 0;
