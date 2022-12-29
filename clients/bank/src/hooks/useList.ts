import { useCallback, useEffect, useState } from 'react';
import { Apis } from '../apis';
import { Constructor, copyConstructor, DefaultList, ListInstance, ListResponse } from '../lib';
import { useSelector } from './useSelector';
import { useRequest } from './';
import { AxiosRequestConfig } from 'axios';

export interface UseListOptions<T extends object = object> {
  initialList: ListInstance<T>;
  apiName: Apis;
  config?: AxiosRequestConfig;
}

export function useList<
  K extends object = object,
  T extends UseListOptions<K>['initialList'] = UseListOptions<K>['initialList']
>({ initialList = new DefaultList(), apiName, config }: UseListOptions<K>) {
  const [createdList, setCreatedList] = useState<T>(initialList as T);
  const { listContainer } = useSelector();
  const { request, isInitialApiProcessing } = useRequest();
  const page = createdList.page;
  const entireList = createdList.list;
  const list = createdList.list[page] || [];
  const take = createdList.take;
  const total = createdList.total;
  const isEmptyList = list.length <= 0;
  const count = Math.ceil(total / take);

  const isListProcessing = useCallback(() => {
    return isInitialApiProcessing(apiName);
  }, [isInitialApiProcessing, apiName]);

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage === page) return;

      if (!isListProcessing()) {
        setCreatedList(prevState => {
          const newState = copyConstructor<T>(prevState);
          return Object.assign(newState, { page: newPage });
        });
        if (listContainer.element) {
          listContainer.element.scrollTo({ behavior: 'smooth', top: 0 });
        }
      }
    },
    [page, isListProcessing, listContainer]
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

  const initializeList = useCallback((list: T) => {
    setCreatedList(list);
  }, []);

  useEffect(() => {
    if (Array.isArray(entireList[page])) return;

    request<any, ListResponse<K>>(apiName, {
      data: { page, take },
      config,
      callback(response) {
        const [list, total]: ListResponse<K> = response.data;
        const billList = new (createdList.constructor as Constructor)() as T;
        billList.list = Object.assign(entireList, { [page]: list });
        billList.page = page;
        billList.total = total;
        initializeList(billList);
      },
    });
  }, [page, take, entireList, apiName, createdList]);

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
    onTakeChange,
    initializeList,
    isListProcessing,
  };
}
