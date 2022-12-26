import { useCallback, useEffect, useState } from 'react';
import { apis, Apis, ResetApi } from '../apis';
import { Constructor, copyConstructor, DefaultList, ListInstance, ListResponse } from '../lib';
import { useSelector } from './useSelector';
import { useAction } from './';

export interface UseListOptions<T extends object = object> {
  initialList: ListInstance<T>;
  apiName: Apis;
}

export function useList<
  K extends object = object,
  T extends UseListOptions<K>['initialList'] = UseListOptions<K>['initialList']
>({ initialList = new DefaultList(), apiName }: UseListOptions<K>) {
  const [createdList, setCreatedList] = useState<T>(initialList as T);
  const { loadings } = useSelector();
  const { asyncOp } = useAction();
  const page = createdList.page;
  const entireList = createdList.list;
  const list = createdList.list[page] || [];
  const take = createdList.take;
  const total = createdList.total;
  const isEmptyList = list.length <= 0;
  const count = Math.ceil(total / take);

  const isListProcessing = useCallback(() => {
    return loadings[apiName] === undefined || loadings[apiName];
  }, [loadings, apiName]);

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage === page) return;

      if (!isListProcessing()) {
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
    <T extends any>(list: T[], page: number) => {
      onListChange(list, page);
      onPageChange(page);
    },
    [onListChange, onPageChange]
  );

  const initializeList = useCallback((list: T) => {
    setCreatedList(list);
  }, []);

  useEffect(() => {
    asyncOp(async () => {
      if (Array.isArray(entireList[page])) return;
      const response = await ResetApi.req(apis[apiName]<K>({ page, take } as any));
      const [list, total]: ListResponse<K> = response.data;
      const billList = new (createdList.constructor as Constructor)() as T;
      billList.list = Object.assign(entireList, { [page]: list });
      billList.page = page;
      billList.total = total;
      initializeList(billList);
    }, apiName);
  }, [page, take, entireList, apiName, createdList, initializeList, asyncOp]);

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
