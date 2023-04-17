import { Fragment, PropsWithChildren, FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ChildRedirectionObj {
  path: string;
}

const RedirectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function parentRedirectionProcess(event: CustomEvent<ChildRedirectionObj>) {
      navigate(event.detail.path);
    }
    /**@ts-ignore */
    window.addEventListener('parent-redirection', parentRedirectionProcess);
    return () => {
      /**@ts-ignore */
      window.removeEventListener('parent-redirection', parentRedirectionProcess);
    };
  }, []);

  useEffect(() => {
    const childRedirection = new CustomEvent('child-redirection', {
      bubbles: true,
      cancelable: true,
      detail: { path: location.pathname },
    });
    window.dispatchEvent(childRedirection);
  }, [location]);

  return <Fragment>{children}</Fragment>;
};

export default RedirectionProvider;
