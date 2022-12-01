import { mount } from 'bank/BankApp';
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Auth() {
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
      });

      onParentNavigate(location.pathname);
    }
  }, [location, navigate]);

  return <div ref={ref} />;
}

export default Auth;
