import { mount } from 'bank/BankApp';
import { useInitialMicro } from '../hooks';

function Auth() {
  const { ref } = useInitialMicro(mount);

  return <div ref={ref} />;
}

export default Auth;
