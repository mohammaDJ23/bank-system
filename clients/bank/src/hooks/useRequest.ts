import { AxiosError, AxiosResponse } from 'axios';
import { useCallback } from 'react';
import { ErrorObj, Request, RootApi, RootApiObj } from '../apis';
import { Constructor } from '../lib';
import { useAction } from './useActions';
import { useSelector } from './useSelector';
import { useSnackbar } from 'notistack';

export function useRequest() {
  const { requestProcess } = useSelector();
  const {
    processingApiLoading,
    processingApiSuccess,
    processingApiError,
    initialProcessingApiLoading,
    initialProcessingApiSuccess,
    initialProcessingApiError,
  } = useAction();
  const { enqueueSnackbar } = useSnackbar();

  const getRequestConstructorName = useCallback(<T extends RootApiObj>(requestInstance: RootApi | Constructor<T>) => {
    if (typeof requestInstance === 'function') return requestInstance.name;
    else return requestInstance.constructor.name;
  }, []);

  const request = useCallback(
    async <R = any, D = any>(requestInstance: RootApi<D>): Promise<AxiosResponse<R, D>> => {
      const requestConstructorName = getRequestConstructorName(requestInstance);
      const isInitialApi = requestInstance.isInitialApi;

      try {
        if (isInitialApi) initialProcessingApiLoading(requestConstructorName);
        else processingApiLoading(requestConstructorName);

        const request = new Request<R, D>(requestInstance);
        const response = await request.build();

        if (isInitialApi) initialProcessingApiSuccess(requestConstructorName);
        else processingApiSuccess(requestConstructorName);

        return response;
      } catch (e) {
        const err = e as AxiosError<ErrorObj> | Error;
        let message =
          err instanceof AxiosError<ErrorObj>
            ? err.response?.data?.message || err.response?.statusText || err.message
            : err instanceof Error
            ? err.message
            : 'Something went wrong';
        message = Array.isArray(message) ? message.join(' - ') : message;
        enqueueSnackbar({ message, variant: 'error' });

        if (isInitialApi) initialProcessingApiError(requestConstructorName);
        else processingApiError(requestConstructorName);

        throw err;
      }
    },
    [
      processingApiLoading,
      processingApiSuccess,
      processingApiError,
      initialProcessingApiLoading,
      initialProcessingApiSuccess,
      initialProcessingApiError,
      getRequestConstructorName,
    ]
  );

  const isProcessingApiLoaded = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.processingApis.loadings[getRequestConstructorName(requestInstance)];
    },
    [requestProcess.processingApis.loadings, getRequestConstructorName]
  );

  const isProcessingApiSuccessed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.processingApis.successes[getRequestConstructorName(requestInstance)];
    },
    [requestProcess.processingApis.successes, getRequestConstructorName]
  );

  const isProcessingApiFailed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.processingApis.errors[getRequestConstructorName(requestInstance)];
    },
    [requestProcess.processingApis.errors, getRequestConstructorName]
  );

  const isInitialProcessingApiLoaded = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.initialProcessingApis.loadings[getRequestConstructorName(requestInstance)];
    },
    [requestProcess.initialProcessingApis.loadings, getRequestConstructorName]
  );

  const isInitialProcessingApiSuccessed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.initialProcessingApis.successes[getRequestConstructorName(requestInstance)];
    },
    [requestProcess.initialProcessingApis.successes, getRequestConstructorName]
  );

  const isInitialProcessingApiFailed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.initialProcessingApis.errors[getRequestConstructorName(requestInstance)];
    },
    [requestProcess.initialProcessingApis.errors, getRequestConstructorName]
  );

  const isApiProcessing = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return (
        isProcessingApiLoaded(requestInstance) &&
        !isProcessingApiSuccessed(requestInstance) &&
        !isProcessingApiFailed(requestInstance)
      );
    },
    [isProcessingApiLoaded, isProcessingApiSuccessed, isProcessingApiFailed]
  );

  const isInitialApiProcessing = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      const isInitialApiLoaded = isInitialProcessingApiLoaded(requestInstance);
      const isInitialApiSuccessed = isInitialProcessingApiSuccessed(requestInstance);
      const isInitialApiFailed = isInitialProcessingApiFailed(requestInstance);
      return (
        (isInitialApiLoaded && !isInitialApiSuccessed && !isInitialApiFailed) ||
        (!isInitialApiLoaded && !isInitialApiSuccessed && !isInitialApiFailed)
      );
    },
    [isInitialProcessingApiLoaded, isInitialProcessingApiSuccessed, isInitialProcessingApiFailed]
  );

  return {
    request,
    isApiProcessing,
    isInitialApiProcessing,
    isProcessingApiLoaded,
    isProcessingApiSuccessed,
    isProcessingApiFailed,
    isInitialProcessingApiLoaded,
    isInitialProcessingApiSuccessed,
    isInitialProcessingApiFailed,
  };
}
