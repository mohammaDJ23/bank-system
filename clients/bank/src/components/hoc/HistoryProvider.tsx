import { FC, PropsWithChildren, Fragment } from 'react';
import { BrowserHistory, MemoryHistory } from 'history';

interface HistoryRouterImportation {
  history: BrowserHistory | MemoryHistory;
}

const HistoryProvider: FC<PropsWithChildren<HistoryRouterImportation>> = ({
  children,
  history,
}) => {
  return <Fragment>{children}</Fragment>;
};

export default HistoryProvider;
