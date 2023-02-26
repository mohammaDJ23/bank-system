import { mount } from 'bank/BankApp';
import { useInitialMicro } from '../hooks';
import { isUserAuthenticated, pathes } from '../lib';
import { Navigate } from 'react-router-dom';

function Auth() {
  const { ref } = useInitialMicro(mount);
  const isUserLoggedIn = isUserAuthenticated();

  return isUserLoggedIn ? <div ref={ref} /> : <Navigate to={pathes.unauthorized} />;
}

export default Auth;
