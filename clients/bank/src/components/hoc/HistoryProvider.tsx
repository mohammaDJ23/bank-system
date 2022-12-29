import { FC, PropsWithChildren, Fragment, useEffect } from 'react';
import { BrowserHistory, MemoryHistory } from 'history';
import { useAction } from '../../hooks';

interface HistoryProviderImportation {
  history: BrowserHistory | MemoryHistory;
}

const HistoryProvider: FC<PropsWithChildren<HistoryProviderImportation>> = ({
  children,
  history,
}) => {
  const { setHistory } = useAction();

  useEffect(() => {
    setHistory(history);
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default HistoryProvider;
