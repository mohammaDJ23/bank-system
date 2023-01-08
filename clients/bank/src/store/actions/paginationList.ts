import { ListInstance } from '../../lib';
import { PaginationList } from '../reducers';

export interface PaginationListObj {
  new (...args: any[]): ListInstance;
}

export interface SetPaginationListAction {
  type: PaginationList.SET_LISTS;
  payload: { list: ListInstance };
}

export interface ChangePaginationListPageAction {
  type: PaginationList.CHANGE_PAGE;
  payload: { page: number; list: PaginationListObj };
}

export interface AddPaginationListAction<T = any> {
  type: PaginationList.ADD_LIST;
  payload: { lists: T[]; list: PaginationListObj };
}

export type PaginationListActions =
  | SetPaginationListAction
  | ChangePaginationListPageAction
  | AddPaginationListAction;

export function setPaginationList(list: ListInstance): SetPaginationListAction {
  return {
    type: PaginationList.SET_LISTS,
    payload: { list },
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

export function addPaginationListAction<T = any>(
  list: PaginationListObj,
  lists: T[]
): AddPaginationListAction<T> {
  return {
    type: PaginationList.ADD_LIST,
    payload: { list, lists },
  };
}
