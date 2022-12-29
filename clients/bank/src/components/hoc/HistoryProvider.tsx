import { FC, PropsWithChildren, Fragment } from 'react';
import { BrowserHistory, MemoryHistory } from 'history';

interface HistoryProviderImportation {
  history: BrowserHistory | MemoryHistory;
}

const HistoryProvider: FC<PropsWithChildren<HistoryProviderImportation>> = ({
  children,
  history,
}) => {
  return <Fragment>{children}</Fragment>;
};

export default HistoryProvider;
