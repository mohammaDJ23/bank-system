import { FC, useRef, Fragment, PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RedirectionObj {
  path: string;
}

const RedirectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    //@ts-ignore
    window.addEventListener('parent-redirection', (event: CustomEvent<RedirectionObj>) => {
      if (event.detail.path !== currentPathRef.current) {
        navigate(event.detail.path, { replace: true });
      }
    });
  }, []);

  useEffect(() => {
    currentPathRef.current = location.pathname;
    const event = new CustomEvent('child-redirection', {
      bubbles: true,
      cancelable: true,
      detail: { path: `${location.pathname}${location.search}` },
    });
    window.dispatchEvent(event);
  }, [location]);

  return <Fragment>{children}</Fragment>;
};

export default RedirectionProvider;
