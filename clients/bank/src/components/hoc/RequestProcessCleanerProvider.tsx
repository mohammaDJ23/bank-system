import { FC, PropsWithChildren, Fragment, useEffect } from 'react';
import { useAction } from '../../hooks';

const RequestProcessCleanerProvider: FC<PropsWithChildren> = ({ children }) => {
  const { cleanRequestProcess } = useAction();

  useEffect(() => {
    return () => {
      cleanRequestProcess();
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default RequestProcessCleanerProvider;
