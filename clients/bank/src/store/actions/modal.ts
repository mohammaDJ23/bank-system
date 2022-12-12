export enum Modal {
  SHOW_MODAL = 'SHOW_MODAL',
  HIDE_MODAL = 'HIDE_MODAL',
  IS_MODAL_ACTIVE = 'IS_MODAL_ACTIVE',
}

export interface ShowModalAction {
  type: Modal.SHOW_MODAL;
  payload: { name: string };
}

export interface HideModalAction {
  type: Modal.HIDE_MODAL;
  payload: { name: string };
}

export interface IsModalActiveAction {
  type: Modal.IS_MODAL_ACTIVE;
  payload: { name: string };
}

export type ModalActions = ShowModalAction | HideModalAction | IsModalActiveAction;

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

export function isModalActive(name: string): IsModalActiveAction {
  return {
    type: Modal.IS_MODAL_ACTIVE,
    payload: { name },
  };
}
