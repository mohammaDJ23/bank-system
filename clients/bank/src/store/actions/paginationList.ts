import { ListInstance } from '../../lib';
import { PaginationList } from '../reducers';

export interface PaginationListObj {
  new (...args: any[]): ListInstance;
}

export interface SetPaginationListAction {
  type: PaginationList.SET_LISTS;
  payload: { lists: PaginationListObj[] };
}

export interface ChangePaginationListPageAction {
  type: PaginationList.CHANGE_PAGE;
  payload: { page: number; list: PaginationListObj };
}

export type PaginationListActions = SetPaginationListAction | ChangePaginationListPageAction;

export function setPaginationList(...lists: PaginationListObj[]): SetPaginationListAction {
  return {
    type: PaginationList.SET_LISTS,
    payload: { lists },
  };
}

export function changePaginationListPage(
  list: PaginationListObj,
  page: number
): ChangePaginationListPageAction {
  return {
    type: PaginationList.CHANGE_PAGE,
    payload: { list, page },
  };
}
