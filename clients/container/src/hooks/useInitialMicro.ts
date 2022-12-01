import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useInitialMicro(mount: Mount) {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mountExportation = useRef<ReturnType<Mount> | null>(null);

  useEffect(() => {
    if (ref.current) {
      mountExportation.current = mount(ref.current, {
        onChildNavigate: function (path) {
          if (location.pathname !== path) {
            navigate(path);
          }
        },

        initialPath: location.pathname,
      });
    }
  }, []);

  useEffect(() => {
    if (mountExportation.current) {
      mountExportation.current.onParentNavigate(location.pathname);
    }
  }, [location]);

  return { ref };
}
