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

export interface InitialProcessingApiLoadingAction {
  type: RequestProcess.INITIAL_PROCESSING_API_LOADING;
  payload: { name: string };
}

export interface InitialProcessingApiSuccessAction {
  type: RequestProcess.INITIAL_PROCESSING_API_SUCCESS;
  payload: { name: string };
}

export interface InitialProcessingApiErrorAction {
  type: RequestProcess.INITIAL_PROCESSING_API_ERROR;
  payload: { name: string };
}

export type RequestProcessActions =
  | ProcessingApiLoadingAction
  | ProcessingApiSuccessAction
  | ProcessingApiErrorAction
  | InitialProcessingApiLoadingAction
  | InitialProcessingApiSuccessAction
  | InitialProcessingApiErrorAction;

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

export function initialProcessingApiLoading(name: string) {
  return {
    type: RequestProcess.INITIAL_PROCESSING_API_LOADING,
    payload: { name },
  };
}

export function initialProcessingApiSuccess(name: string) {
  return {
    type: RequestProcess.INITIAL_PROCESSING_API_SUCCESS,
    payload: { name },
  };
}

export function initialProcessingApiError(name: string) {
  return {
    type: RequestProcess.INITIAL_PROCESSING_API_ERROR,
    payload: { name },
  };
}
