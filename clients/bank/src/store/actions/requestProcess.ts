import { Apis } from '../../apis';
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

export function loading(name: Apis) {
  return {
    type: RequestProcess.LOADING,
    payload: { name },
  };
}

export function success(name: Apis) {
  return {
    type: RequestProcess.SUCCESS,
    payload: { name },
  };
}

export function error(name: Apis) {
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
