import { useMemo } from 'react';
import { Apis } from '../apis';
import { ListInstance, ListInstanceConstructor } from '../lib';
import { useAction, useRequest, useSelector } from './';

export function usePaginationList() {
  const { setPaginationList, changePaginationListPage } = useAction();
  const { isInitialApiProcessing } = useRequest();
  const { listContainer, paginationList } = useSelector();

  return useMemo(
    function () {
      return function <T>(listInstance: ListInstanceConstructor<ListInstance<T>>) {
        function setList<R extends ListInstance>(newListInstance: R) {
          setPaginationList(newListInstance);
        }

        function onPageChange(page: number) {
          changePaginationListPage(listInstance, page);
          if (listContainer.element) {
            listContainer.element.scrollTo({ behavior: 'smooth', top: 0 });
          }
        }

        function isListProcessing(apiName: Apis) {
          return isInitialApiProcessing(apiName);
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

        return {
          isListProcessing,
          setList,
          onPageChange,
          getListInfo,
          isListEmpty,
          getCurrentList,
          getCount,
          getPage,
          getTake,
          getTotal,
        };
      };
    },
    [
      listContainer,
      paginationList,
      setPaginationList,
      changePaginationListPage,
      isInitialApiProcessing,
    ]
  );
}
