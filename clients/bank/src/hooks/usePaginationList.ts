import { useMemo } from 'react';
import { Constructor, ListInstance, ListInstanceConstructor } from '../lib';
import { useAction, useSelector } from './';

interface InsertNewListOptions<T = any> {
  page?: number;
  list: T[];
  total: number;
}

export function usePaginationList<T>(listInstance: ListInstanceConstructor<ListInstance<T>>) {
  const { setPaginationList, changePaginationListPage } = useAction();
  const { listContainer, paginationList } = useSelector();

  return useMemo(
    function () {
      function setList<R extends ListInstance>(newListInstance: R) {
        setPaginationList(newListInstance);
      }

      function onPageChange(page: number) {
        changePaginationListPage(listInstance, page);
        if (listContainer.element) {
          listContainer.element.scrollTo({ behavior: 'smooth', top: 0 });
        }
      }

      function getListInstance(): InstanceType<typeof listInstance> {
        return paginationList[listInstance.name];
      }

      function isListEmpty(): boolean {
        const listInstance = getListInstance();
        return Object.keys(listInstance.list).length <= 0;
      }

      function getCurrentList() {
        const listInstance = getListInstance();
        return listInstance.list[listInstance.page] || [];
      }

      function getCount() {
        const listInstance = getListInstance();
        return Math.ceil(listInstance.total / listInstance.take);
      }

      function getPage() {
        const listInstance = getListInstance();
        return listInstance.page;
      }

      function getTake() {
        const listInstance = getListInstance();
        return listInstance.take;
      }

      function getTotal() {
        const listInstance = getListInstance();
        return listInstance.total;
      }

      function getFullInfo() {
        return {
          list: getCurrentList(),
          page: getPage(),
          take: getTake(),
          total: getTotal(),
          count: getCount(),
          isListEmpty: isListEmpty(),
          lists: getListInstance().list,
        };
      }

      function insertNewList({ page, total, list }: InsertNewListOptions<T>) {
        const listInstance = getListInstance();
        const listInfo = getFullInfo();

        page = page || listInfo.page;

        const constructedList = new (listInstance.constructor as Constructor<ListInstance<T>>)();

        if (list.length <= 0 && total <= 0) {
          constructedList.list = {};
        } else {
          constructedList.list = Object.assign(listInfo.lists, { [page]: list });
        }

        constructedList.total = total;
        constructedList.page = page;
        setList(constructedList);
      }

      function isNewPageEqualToCurrentPage(newPage: number) {
        const listInfo = getFullInfo();
        return newPage === listInfo.page;
      }

      function isNewPageExist(newPage: number) {
        const listInfo = getFullInfo();
        return !!listInfo.lists[newPage];
      }

      return {
        setList,
        onPageChange,
        getListInstance,
        isListEmpty,
        getCurrentList,
        getCount,
        getPage,
        getTake,
        getTotal,
        getFullInfo,
        insertNewList,
        isNewPageEqualToCurrentPage,
        isNewPageExist,
      };
    },
    [listContainer, paginationList, listInstance, setPaginationList, changePaginationListPage]
  );
}
