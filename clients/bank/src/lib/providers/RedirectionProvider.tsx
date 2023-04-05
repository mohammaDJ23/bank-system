import { Fragment, PropsWithChildren, FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RedirectionDetailObj {
  path: string;
}

const RedirectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    /**@ts-ignore */
    window.addEventListener('parent-redirection', (event: CustomEvent<RedirectionDetailObj>) => {
      navigate(event.detail.path);
    });
  }, []);

  useEffect(() => {
    const childRedirectionEvent = new CustomEvent('child-redirection', {
      bubbles: true,
      cancelable: true,
      detail: { path: location.pathname },
    });
    window.dispatchEvent(childRedirectionEvent);
  }, [location]);

  return <Fragment>{children}</Fragment>;
};

export default RedirectionProvider;
