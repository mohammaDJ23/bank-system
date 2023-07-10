import { copyConstructor, ListInstance, lists } from '../../lib';
import {
  AddPaginationListAction,
  ChangePaginationListPageAction,
  RootActions,
  SetPaginationListAction,
} from '../actions';
import { ClearState } from './clearState';

export enum PaginationList {
  SET_LISTS = 'SET_LISTS',
  CHANGE_PAGE = 'CHANGE_PAGE',
  ADD_LIST = 'ADD_LIST',
}

interface PaginationListState {
  [key: string]: ListInstance;
}

function makeListState() {
  let state: PaginationListState = {};
  for (let list in lists) state[list] = new lists[list as keyof typeof lists]();
  return state;
}

export const initialState: PaginationListState = makeListState();

function setList(state: PaginationListState, action: SetPaginationListAction): PaginationListState {
  const newState = Object.assign<object, PaginationListState>({}, state);
  const list = action.payload.list;
  newState[list.constructor.name] = list;
  return newState;
}

function changePage(
  state: PaginationListState,
  action: ChangePaginationListPageAction
): PaginationListState {
  const { list: ListInstance, page: listInstancePage } = action.payload;
  const page = Math.sign(listInstancePage) <= 0 ? 1 : listInstancePage;
  const copiedList = copyConstructor(state[ListInstance.name]);
  const newState = Object.assign<object, PaginationListState>({}, state);
  newState[ListInstance.name] = copiedList;
  newState[ListInstance.name].page = page;
  return newState;
}

function addList(state: PaginationListState, action: AddPaginationListAction): PaginationListState {
  const { list: ListInstance, lists } = action.payload;
  const copiedList = copyConstructor(state[ListInstance.name]);
  const newState = Object.assign<object, PaginationListState>({}, state);
  newState[ListInstance.name] = copiedList;
  newState[ListInstance.name].list[newState[ListInstance.name].page] = lists;
  return newState;
}

function clearState(): PaginationListState {
  return makeListState();
}

export function paginationListReducer(
  state: PaginationListState = initialState,
  actions: RootActions
) {
  switch (actions.type) {
    case PaginationList.SET_LISTS:
      return setList(state, actions);

    case PaginationList.CHANGE_PAGE:
      return changePage(state, actions);

    case PaginationList.ADD_LIST:
      return addList(state, actions);

    case ClearState.CLEAR_STATE:
      return clearState();

    default:
      return state;
  }
}
