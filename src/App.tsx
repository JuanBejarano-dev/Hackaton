import { ServerWakeNotice } from '@molecules/ServerWakeNotice';
import { useServerWaking } from '@hooks/useServerWaking';
import { AppRouter } from './routes/AppRouter';

export function App() {
  const isServerWaking = useServerWaking();

  return (
    <>
      <AppRouter />
      <ServerWakeNotice visible={isServerWaking} />
    </>
  );
}
