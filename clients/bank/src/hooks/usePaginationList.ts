import { useMemo } from 'react';
import { ListInstance, ListInstanceConstructor } from '../lib';
import { useAction, useSelector } from './';

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

      function getListInfo(): InstanceType<typeof listInstance> {
        return paginationList[listInstance.name];
      }

      function isListEmpty(): boolean {
        const list = getCurrentList();
        return list.length <= 0;
      }

      function getCurrentList() {
        const listInfo = getListInfo();
        return listInfo.list[listInfo.page] || [];
      }

      function getCount() {
        const listInfo = getListInfo();
        return Math.ceil(listInfo.total / listInfo.take);
      }

      function getPage() {
        const listInfo = getListInfo();
        return listInfo.page;
      }

      function getTake() {
        const listInfo = getListInfo();
        return listInfo.take;
      }

      function getTotal() {
        const listInfo = getListInfo();
        return listInfo.total;
      }

      function getFullInfo() {
        return {
          list: getCurrentList(),
          page: getPage(),
          take: getTake(),
          total: getTotal(),
          count: getCount(),
          isListEmpty: isListEmpty(),
          lists: getListInfo().list,
        };
      }

      return {
        setList,
        onPageChange,
        getListInfo,
        isListEmpty,
        getCurrentList,
        getCount,
        getPage,
        getTake,
        getTotal,
        getFullInfo,
      };
    },
    [listContainer, paginationList, listInstance, setPaginationList, changePaginationListPage]
  );
}
