import { ListInstance } from '../../lib';
import { PaginationList } from '../reducers';

export interface PaginationListObj {
  new (...args: any[]): ListInstance;
}

export interface SetPaginationListAction {
  type: PaginationList.SET_LISTS;
  payload: { lists: PaginationListObj[] };
}

export type PaginationListActions = SetPaginationListAction;

export function setPaginationList(...lists: PaginationListObj[]): SetPaginationListAction {
  return {
    type: PaginationList.SET_LISTS,
    payload: { lists },
  };
}
