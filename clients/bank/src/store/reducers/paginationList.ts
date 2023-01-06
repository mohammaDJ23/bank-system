import { ListInstance } from '../../lib';
import {
  ChangePaginationListPageAction,
  PaginationListActions,
  SetPaginationListAction,
} from '../actions';

export enum PaginationList {
  SET_LISTS = 'SET_LISTS',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_LIST = 'CHANGE_LIST',
  CHANGE_TAKE = 'CHANGE_TAKE',
}

interface PaginationListState {
  [key: string]: ListInstance;
}

export const initialState: PaginationListState = {};

function setLists(
  state: PaginationListState,
  action: SetPaginationListAction
): PaginationListState {
  const newState = Object.assign<object, PaginationListState>({}, state);
  for (const ListInstance of action.payload.lists) newState[ListInstance.name] = new ListInstance();
  return newState;
}

function changePage(
  state: PaginationListState,
  action: ChangePaginationListPageAction
): PaginationListState {
  const { list: ListInstance, page: listInstancePage } = action.payload;
  const page = Math.sign(listInstancePage) <= 0 ? 1 : listInstancePage;
  const newState = Object.assign<object, PaginationListState>({}, state);
  newState[ListInstance.name].page = page;
  return newState;
}

export function paginationListReducer(
  state: PaginationListState = initialState,
  actions: PaginationListActions
) {
  switch (actions.type) {
    case PaginationList.SET_LISTS:
      return setLists(state, actions);

    case PaginationList.CHANGE_PAGE:
      return changePage(state, actions);

    default:
      return state;
  }
}
