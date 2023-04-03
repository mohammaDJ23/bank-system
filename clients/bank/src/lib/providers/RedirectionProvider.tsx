import { Fragment, PropsWithChildren, FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RedirectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();

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
