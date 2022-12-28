import { Dispatch, Store } from 'redux';
import { Apis, ErrorObj } from '../../apis';
import { RequestProcess } from '../reducers';
import { RootState } from '../store';
import { RootActions } from './root-actions';
import { Notification } from 'element-react';
import { AxiosError } from 'axios';

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
      let message =
        err instanceof AxiosError<ErrorObj>
          ? err.response?.data?.message || err.response?.statusText || err.message
          : err instanceof Error
          ? err.message
          : 'Something went wrong';
      message = Array.isArray(message) ? message.join(' - ') : message;

      dispatch(error(apiName));
      Notification(message, 'error');
    }
  };
}
