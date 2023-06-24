import { HideModalAction, RootActions, ShowModalAction } from '../actions';
import { ClearState } from './clearState';

export enum Modal {
  SHOW_MODAL = 'SHOW_MODAL',
  HIDE_MODAL = 'HIDE_MODAL',
}

export enum ModalNames {
  CONFIRMATION = 'CONFIRMATION',
  USER_FILTERS = 'USER_FILTERS',
  BILL_FILTERS = 'BILL_FILTERS',
  DELETED_USER_FILTERS = 'DELETED_USER_FILTERS',
  DELETED_BILL_FILTERS = 'DELETED_BILL_FILTERS',
  RESTORE_USER = 'RESTORE_USER',
  RESTORE_BILL = 'RESTORE_BILL',
}

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

function clearState(): ModalState {
  return {};
}

export function modalReducer(state: ModalState = initialState, actions: RootActions): ModalState {
  switch (actions.type) {
    case Modal.SHOW_MODAL:
      return showModal(state, actions);

    case Modal.HIDE_MODAL:
      return hideModal(state, actions);

    case ClearState.CLEAR_STATE:
      return clearState();

    default:
      return state;
  }
}
