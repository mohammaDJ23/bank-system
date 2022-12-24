import { Dispatch, Store } from 'redux';
import { Apis } from '../../apis';
import { RootState } from '../store';
import { RootActions } from './root-actions';

export enum RequestProcess {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

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

export type RequestProcessActions = LoadingAction | SuccessAction | ErrorAction;

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

export function asyncOp(
  cb: (dispatch: Dispatch<RootActions>, store: Store<RootState>) => Promise<any> | any,
  apiName: Apis
) {
  return async function (dispatch: Dispatch<RootActions>, store: Store<RootState>) {
    try {
      dispatch(loading(apiName));
      await cb.call({ dispatch, store }, dispatch, store);
      dispatch(success(apiName));
    } catch (err) {
      dispatch(error(apiName));
    }
  };
}
