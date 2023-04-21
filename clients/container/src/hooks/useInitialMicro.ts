import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { history } from '../App';

export function useInitialMicro(app: MicroApp) {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (ref.current) {
      const { mount, unMount } = app(ref.current);

      const { onParentNavigate } = mount({
        onChildNavigate(path: string) {
          if (path !== location.pathname) {
            navigate(path);
          }
        },
        initialPath: location.pathname,
      });

      history.listen(update => {
        onParentNavigate(update.location.pathname);
      });
    }
  }, []);

  return { ref };
}
