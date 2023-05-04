import { useEffect, useRef } from 'react';

export function useInitialMicro(app: MicroApp) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const { mount, unMount } = app(ref.current);
      mount();
    }
  }, []);

  return { ref };
}
