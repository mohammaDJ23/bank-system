import { FC, PropsWithChildren, Fragment } from 'react';

const StateCleanerProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export default StateCleanerProvider;
