import { Modal } from '../reducers';

export interface ShowModalAction {
  type: Modal.SHOW_MODAL;
  payload: { name: string };
}

export interface HideModalAction {
  type: Modal.HIDE_MODAL;
  payload: { name: string };
}

export type ModalActions = ShowModalAction | HideModalAction;

export function showModal(name: string): ShowModalAction {
  return {
    type: Modal.SHOW_MODAL,
    payload: { name },
  };
}

export function hideModal(name: string): HideModalAction {
  return {
    type: Modal.HIDE_MODAL,
    payload: { name },
  };
}
