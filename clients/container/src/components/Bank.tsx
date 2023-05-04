import { app } from 'bank/BankApp';
import { useInitialMicro } from '../hooks';

function Bank() {
  const { ref } = useInitialMicro(app);

  return <div ref={ref} />;
}

export default Bank;
