import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useInitialMicro(app: MicroApp) {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    if (ref.current) {
      const { mount, unMount } = app(ref.current);
      mount();
    }
  }, []);

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
      detail: { path: location.pathname },
    });
    window.dispatchEvent(event);
  }, [location]);

  return { ref };
}
