import { HideModalAction, Modal, ModalActions, ShowModalAction } from '../actions';

export interface ModalState {
  [key: string]: boolean;
}

const initialState: ModalState = {};

function getNewState(state: ModalState): ModalState {
  return Object.assign({}, state);
}

function showModal(state: ModalState, action: ShowModalAction): ModalState {
  const newState = getNewState(state);
  newState[action.payload.name] = true;
  return newState;
}

function hideModal(state: ModalState, action: HideModalAction): ModalState {
  const newState = getNewState(state);
  delete newState[action.payload.name];
  return newState;
}

export function modalReducer(state: ModalState = initialState, actions: ModalActions): ModalState {
  switch (actions.type) {
    case Modal.SHOW_MODAL:
      return showModal(state, actions);

    case Modal.HIDE_MODAL:
      return hideModal(state, actions);

    default:
      return state;
  }
}
