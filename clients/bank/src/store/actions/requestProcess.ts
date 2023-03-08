import { RequestProcess } from '../reducers';

export interface ProcessingApiLoadingAction {
  type: RequestProcess.PROCESSING_API_LOADING;
  payload: { name: string };
}

export interface ProcessingApiSuccessAction {
  type: RequestProcess.PROCESSING_API_SUCCESS;
  payload: { name: string };
}

export interface ProcessingApiErrorAction {
  type: RequestProcess.PROCESSING_API_ERROR;
  payload: { name: string };
}

export interface CleanAction {
  type: RequestProcess.CLEAN;
}

export type RequestProcessActions =
  | ProcessingApiLoadingAction
  | ProcessingApiSuccessAction
  | ProcessingApiErrorAction
  | CleanAction;

export function processingApiLoading(name: string) {
  return {
    type: RequestProcess.PROCESSING_API_LOADING,
    payload: { name },
  };
}

export function processingApiSuccess(name: string) {
  return {
    type: RequestProcess.PROCESSING_API_SUCCESS,
    payload: { name },
  };
}

export function processingApiError(name: string) {
  return {
    type: RequestProcess.PROCESSING_API_ERROR,
    payload: { name },
  };
}

export function cleanRequestProcess() {
  return {
    type: RequestProcess.CLEAN,
  };
}
