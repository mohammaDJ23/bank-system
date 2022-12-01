import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useInitialMicro(mount: Mount) {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (ref.current) {
      const { onParentNavigate } = mount(ref.current, {
        onChildNavigate: function (path) {
          if (location.pathname !== path) {
            navigate(path);
          }
        },

        initialPath: location.pathname,
      });

      onParentNavigate(location.pathname);
    }
  }, [location, navigate, mount]);

  return { ref };
}
