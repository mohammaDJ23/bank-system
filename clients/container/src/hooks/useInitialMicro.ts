import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useInitialMicro(mount: Mount) {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const childPath = useRef<string>('');

  useEffect(() => {
    if (ref.current) {
      mount(ref.current);
      /**@ts-ignore */
      window.addEventListener('child-redirection', (event: CustomEvent<RedirectionDetailObj>) => {
        childPath.current = event.detail.path;
        navigate(event.detail.path);
      });
    }
  }, []);

  useEffect(() => {
    if (childPath.current !== location.pathname) {
      const parentRedirectionEvent = new CustomEvent('parent-redirection', {
        bubbles: true,
        cancelable: true,
        detail: { path: location.pathname },
      });
      window.dispatchEvent(parentRedirectionEvent);
    }
  }, [location]);

  return { ref };
}
