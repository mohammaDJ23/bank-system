import { RequestProcess } from '../reducers';

export interface LoadingAction {
  type: RequestProcess.LOADING;
  payload: { name: string };
}

export interface SuccessAction {
  type: RequestProcess.SUCCESS;
  payload: { name: string };
}

export interface ErrorAction {
  type: RequestProcess.ERROR;
  payload: { name: string };
}

export interface CleanAction {
  type: RequestProcess.CLEAN;
}

export type RequestProcessActions = LoadingAction | SuccessAction | ErrorAction | CleanAction;

export function loading(name: string) {
  return {
    type: RequestProcess.LOADING,
    payload: { name },
  };
}

export function success(name: string) {
  return {
    type: RequestProcess.SUCCESS,
    payload: { name },
  };
}

export function error(name: string) {
  return {
    type: RequestProcess.ERROR,
    payload: { name },
  };
}

export function cleanRequestProcess() {
  return {
    type: RequestProcess.CLEAN,
  };
}
