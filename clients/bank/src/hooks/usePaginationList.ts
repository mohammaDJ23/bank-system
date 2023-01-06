import { useCallback } from 'react';
import { Apis } from '../apis';
import { useAction, useRequest } from './';

export function usePaginationList() {
  const { setPaginationList } = useAction();
  const { isInitialApiProcessing } = useRequest();

  const setLists = useCallback(
    (...lists: Parameters<typeof setPaginationList>) => {
      setPaginationList(...lists);
    },
    [setPaginationList]
  );

  const isListProcessing = useCallback(
    (apiName: Apis) => {
      return isInitialApiProcessing(apiName);
    },
    [isInitialApiProcessing]
  );

  return { isListProcessing, setLists };
}
