import { FC, PropsWithChildren, useRef, useEffect, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RedirectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    //@ts-ignore
    window.addEventListener('child-redirection', (event: CustomEvent<RedirectionObj>) => {
      if (event.detail.path !== currentPathRef.current) {
        navigate(event.detail.path, { replace: true });
      }
    });
  }, []);

  useEffect(() => {
    currentPathRef.current = location.pathname;
    const event = new CustomEvent('parent-redirection', {
      bubbles: true,
      cancelable: true,
      detail: { path: `${location.pathname}${location.search}` },
    });
    window.dispatchEvent(event);
  }, [location]);

  return <Fragment>{children}</Fragment>;
};

export default RedirectionProvider;
