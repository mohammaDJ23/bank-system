import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { useAction } from '../../hooks';

const ClearStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const { clearState } = useAction();

  useEffect(() => {
    function clearStateProcess() {
      clearState();
    }
    window.addEventListener('popstate', clearStateProcess);

    return () => {
      window.removeEventListener('popstate', clearStateProcess);
      clearState();
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default ClearStateProvider;
