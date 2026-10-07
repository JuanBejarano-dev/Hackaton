import { useSyncExternalStore } from 'react';
import { isServerWaking, subscribeServerWaking } from '@services/serverStatus';

/** true mientras haya alguna petición que tarda más de 5 s (servidor despertando). */
export const useServerWaking = (): boolean => useSyncExternalStore(subscribeServerWaking, isServerWaking);
