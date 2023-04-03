import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function useInitialMicro(mount: Mount) {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (ref.current) {
      mount(ref.current);

      /**@ts-ignore */
      window.addEventListener('child-redirection', (event: CustomEvent<RedirectionDetailObj>) => {
        navigate(event.detail.path);
      });
    }
  }, []);

  return { ref };
}
