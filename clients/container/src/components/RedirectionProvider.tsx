import { Fragment, PropsWithChildren, FC, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ChildRedirectionObj {
  path: string;
}

const RedirectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const childPathRef = useRef<string>('');

  console.log('parent', location.pathname);

  useEffect(() => {
    function childRedirectionProcess(event: CustomEvent<ChildRedirectionObj>) {
      if (childPathRef.current !== event.detail.path) {
        childPathRef.current = event.detail.path;
        navigate(event.detail.path);
      }
    }
    /**@ts-ignore */
    window.addEventListener('child-redirection', childRedirectionProcess);
    return () => {
      /**@ts-ignore */
      window.removeEventListener('child-redirection', childRedirectionProcess);
    };
  }, []);

  useEffect(() => {
    if (childPathRef.current !== location.pathname) {
      const parentRedirection = new CustomEvent('parent-redirection', {
        bubbles: true,
        cancelable: true,
        detail: { path: location.pathname },
      });
      window.dispatchEvent(parentRedirection);
    }
  }, [location]);

  return <Fragment>{children}</Fragment>;
};

export default RedirectionProvider;
