import { useCallback } from 'react';
import { Apis } from '../apis';
import { ListInstance, ListInstanceConstructor } from '../lib';
import { useAction, useRequest, useSelector } from './';

export function usePaginationList() {
  const { setPaginationList, changePaginationListPage } = useAction();
  const { isInitialApiProcessing } = useRequest();
  const { listContainer, paginationList } = useSelector();

  const setLists = useCallback(
    (...lists: Parameters<typeof setPaginationList>) => {
      setPaginationList(...lists);
    },
    [setPaginationList]
  );

  const onPageChange = useCallback(
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

  const getListInfo = useCallback(
    <T>(
      listInstance: ListInstanceConstructor<ListInstance<T>>
    ): InstanceType<ListInstanceConstructor<ListInstance<T>>> => {
      return paginationList[listInstance.constructor.name];
    },
    [paginationList]
  );

  const isListEmpty = useCallback(
    <T>(listInstance: ListInstanceConstructor<ListInstance<T>>): boolean => {
      const listInfo = paginationList[listInstance.constructor.name];
      return listInfo.list[listInfo.page].length <= 0;
    },
    [paginationList]
  );

  return { isListProcessing, setLists, onPageChange, getListInfo, isListEmpty };
}
