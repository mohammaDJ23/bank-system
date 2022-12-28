import { RootActions, SetListContainerElementAction } from '../actions';

export enum ListContainer {
  SET_LIST_CONTAINER_ELEMENT = 'SET_LIST_CONTAINER_ELEMENT',
}

export interface ListContainerState {
  element: HTMLDivElement | null;
}

const initialState: ListContainerState = {
  element: null,
};

function setListContainerElement(
  state: ListContainerState,
  action: SetListContainerElementAction
): ListContainerState {
  return {
    ...state,
    element: action.payload.element,
  };
}

export function ListContainerReducer(
  state: ListContainerState = initialState,
  actions: RootActions
): ListContainerState {
  switch (actions.type) {
    case ListContainer.SET_LIST_CONTAINER_ELEMENT:
      return setListContainerElement(state, actions);

    default:
      return state;
  }
}
