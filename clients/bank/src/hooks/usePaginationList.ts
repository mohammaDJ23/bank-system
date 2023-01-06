import { useCallback } from 'react';
import { Apis } from '../apis';
import { useAction, useRequest } from './';

export function usePaginationList() {
  const { setPaginationList, changePaginationListPage } = useAction();
  const { isInitialApiProcessing } = useRequest();

  const setLists = useCallback(
    (...lists: Parameters<typeof setPaginationList>) => {
      setPaginationList(...lists);
    },
    [setPaginationList]
  );

  const changePage = useCallback(
    (...args: Parameters<typeof changePaginationListPage>) => {
      const [ListInstance, page] = args;
      changePaginationListPage(ListInstance, page);
    },
    [changePaginationListPage]
  );

  const isListProcessing = useCallback(
    (apiName: Apis) => {
      return isInitialApiProcessing(apiName);
    },
    [isInitialApiProcessing]
  );

  return { isListProcessing, setLists, changePage };
}
