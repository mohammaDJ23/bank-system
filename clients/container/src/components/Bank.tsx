import { mount } from 'bank/BankApp';
import { useInitialMicro } from '../hooks';
import { isUserAuthenticated, pathes } from '../lib';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Auth() {
  const { ref } = useInitialMicro(mount);
  const navigate = useNavigate();
  const isUserLoggedIn = isUserAuthenticated();

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate(pathes.unauthorized);
    }
  }, [isUserLoggedIn, navigate]);

  return isUserLoggedIn ? <div ref={ref} /> : null;
}

export default Auth;
