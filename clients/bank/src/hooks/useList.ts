import { useCallback, useState } from 'react';
import { Apis } from '../apis';
import { copyConstructor, DefaultList, ListInstance } from '../lib';
import { useSelector } from './useSelector';

export function useList<K extends object, T extends ListInstance<K> = ListInstance<K>>(
  initialList: T = new DefaultList() as T
) {
  const [createdList, setCreatedList] = useState<T>(initialList);
  const { loadings } = useSelector();
  const page = createdList.page;
  const entireList = createdList.list;
  const list = createdList.list[page] || [];
  const take = createdList.take;
  const total = createdList.total;
  const isEmptyList = list.length <= 0;
  const count = Math.ceil(total / take);

  const isListProcessing = useCallback(
    (apiName: Apis) => {
      return loadings[apiName] === undefined || loadings[apiName];
    },
    [loadings]
  );

  const onPageChange = useCallback(
    (newPage: number, apiName: Apis) => {
      if (newPage === page) return;

      if (!isListProcessing(apiName)) {
        setCreatedList(prevState => {
          const newState = copyConstructor<T>(prevState);
          return Object.assign(newState, { page: newPage });
        });
      }
    },
    [page, isListProcessing]
  );

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
    <T extends any>(list: T[], page: number, apiName: Apis) => {
      onListChange(list, page);
      onPageChange(page, apiName);
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
    total,
    count,
    isEmptyList,
    entireList,
    onPageChange,
    onListChange,
    onChange,
    onTakeChange,
    initializeList,
    isListProcessing,
  };
}
