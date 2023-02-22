import { Fragment, useEffect, FC, PropsWithChildren } from 'react';
import { useAction } from '../../hooks';

const ClearStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const { clearState } = useAction();

  useEffect(() => {
    return () => {
      clearState();
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default ClearStateProvider;
