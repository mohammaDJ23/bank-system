import { ListInstance } from '../../lib';
import { PaginationListActions, SetPaginationListAction } from '../actions';

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

export function paginationListReducer(
  state: PaginationListState = initialState,
  actions: PaginationListActions
) {
  switch (actions.type) {
    case PaginationList.SET_LISTS:
      return setLists(state, actions);

    default:
      return state;
  }
}
