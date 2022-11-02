import { mount } from 'auth/AuthApp';
import { useEffect, useRef } from 'react';

function Auth() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) mount(ref.current);
  }, []);

  return <div ref={ref} />;
}

export default Auth;
