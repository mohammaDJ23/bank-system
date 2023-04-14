import { mount } from 'bank/BankApp';
import { useInitialMicro } from '../hooks';

function Bank() {
  const { ref } = useInitialMicro(mount);

  return <div ref={ref} />;
}

export default Bank;
