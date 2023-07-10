import { app } from 'auth/AuthApp';
import { useInitialMicro } from '../hooks';

function Auth() {
  const { ref } = useInitialMicro(app);

  return <div ref={ref} />;
}

export default Auth;
