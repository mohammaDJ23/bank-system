import { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { useCallback } from 'react';
import { Apis } from '../apis';
import { ListInstance } from '../lib';
import { useAction, useRequest, useSelector } from './';

interface UsePaginationImportation {
  listInstance: ListInstance;
  apiName: Apis;
  data: AxiosRequestConfig;
  config?: CreateAxiosDefaults<UsePaginationImportation>;
}

export function usePaginationList(...lists: UsePaginationImportation[]) {
  const { setPaginationList, changePaginationListPage } = useAction();
  const { isInitialApiProcessing } = useRequest();
  const { listContainer } = useSelector();

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
      if (listContainer.element) {
        listContainer.element.scrollTo({ behavior: 'smooth', top: 0 });
      }
    },
    [changePaginationListPage, listContainer]
  );

  const isListProcessing = useCallback(
    (apiName: Apis) => {
      return isInitialApiProcessing(apiName);
    },
    [isInitialApiProcessing]
  );

  return { isListProcessing, setLists, changePage };
}
