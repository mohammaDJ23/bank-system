import { useCallback, useState } from 'react';
import { apis, ResetApi } from '../apis';
import { copyConstructor, DefaultList, ListInstance } from '../lib';

export function useList<K extends object, T extends ListInstance<K> = ListInstance<K>>(
  initialList: T = new DefaultList() as T
) {
  const [createdList, setCreatedList] = useState<T>(initialList);
  const page = createdList.page;
  const list = createdList.list[page] || [];
  const take = createdList.take;
  const isEmptyList = list.length <= 0;

  const onPageChange = useCallback((page: number) => {
    setCreatedList(prevState => {
      const newState = copyConstructor<T>(prevState);
      return Object.assign(newState, { page });
    });
  }, []);

  const onListChange = useCallback(<K extends any>(list: K[], page: number) => {
    setCreatedList(prevState => {
      const newState = copyConstructor<T>(prevState);
      const copiedList = Object.assign(newState.list, { [page]: list });
      return Object.assign(newState, { list: copiedList });
    });
  }, []);

  const onTakeChange = useCallback((take: number) => {
    setCreatedList(prevState => {
      const newState = copyConstructor<T>(prevState);
      return Object.assign(newState, { take });
    });
  }, []);

  const onChange = useCallback(
    <T extends any>(list: T[], page: number) => {
      onListChange(list, page);
      onPageChange(page);
    },
    [onListChange, onPageChange]
  );

  const initializeList = useCallback((list: T) => {
    setCreatedList(list);
  }, []);

  return {
    list,
    page,
    take,
    isEmptyList,
    onPageChange,
    onListChange,
    onChange,
    onTakeChange,
    initializeList,
  };
}
