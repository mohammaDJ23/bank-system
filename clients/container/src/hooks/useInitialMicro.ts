import { useEffect, useRef } from 'react';

export function useInitialMicro(mount: Mount) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      mount(ref.current);
    }
  }, []);

  return { ref };
}
