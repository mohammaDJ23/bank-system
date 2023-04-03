import { RootActions, SetListContainerElementAction } from '../actions';
import { ClearState } from './clearState';

export enum ListContainer {
  SET_LIST_CONTAINER_ELEMENT = 'SET_LIST_CONTAINER_ELEMENT',
}

export interface ListContainerState {
  element: HTMLDivElement | null;
}

const initialState: ListContainerState = {
  element: null,
};

function setListContainerElement(state: ListContainerState, action: SetListContainerElementAction): ListContainerState {
  return {
    ...state,
    element: action.payload.element,
  };
}

function clearState(state: ListContainerState): ListContainerState {
  return { ...state, element: null };
}

export function listContainerReducer(
  state: ListContainerState = initialState,
  actions: RootActions
): ListContainerState {
  switch (actions.type) {
    case ListContainer.SET_LIST_CONTAINER_ELEMENT:
      return setListContainerElement(state, actions);

    case ClearState.CLEAR_STATE:
      return clearState(state);

    default:
      return state;
  }
}
