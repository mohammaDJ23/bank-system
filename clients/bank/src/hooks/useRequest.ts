import { AxiosError, AxiosResponse } from 'axios';
import { notification } from 'antd';
import { useCallback, useEffect } from 'react';
import { ErrorObj, Request, RootApi, RootApiObj } from '../apis';
import { Constructor } from '../lib';
import { useAction } from './useActions';
import { useSelector } from './useSelector';

export function useRequest() {
  const { requestProcess } = useSelector();
  const { cleanRequestProcess, processingApiLoading, processingApiSuccess, processingApiError } = useAction();

  const getRequestConstructorName = useCallback(<T extends RootApiObj>(requestInstance: RootApi | Constructor<T>) => {
    if (typeof requestInstance === 'function') return requestInstance.name;
    else return requestInstance.constructor.name;
  }, []);

  const request = useCallback(
    async <R = any, D = any>(requestInstance: RootApi<D>): Promise<AxiosResponse<R, D>> => {
      const requestConstructorName = getRequestConstructorName(requestInstance);
      const isInitialApi = requestInstance.isInitialApi;

      try {
        if (isInitialApi) {
        } else processingApiLoading(requestConstructorName);

        const request = new Request<R, D>(requestInstance);
        const response = await request.build();

        if (isInitialApi) {
        } else processingApiSuccess(requestConstructorName);

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
        notification.error({ message: 'Error', description: message });

        if (isInitialApi) {
        } else processingApiError(requestConstructorName);

        throw err;
      }
    },
    [processingApiLoading, processingApiSuccess, processingApiError, getRequestConstructorName]
  );

  const isProcessingApiLoaded = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.processingApis.loadings[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isProcessingApiSuccessed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.processingApis.successes[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isProcessingApiFailed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.processingApis.errors[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isInitialProcessingApiLoaded = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.initialProcessingApis.loadings[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isInitialProcessingApiSuccessed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.initialProcessingApis.successes[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isInitialProcessingApiFailed = useCallback(
    <T extends RootApi>(requestInstance: Constructor<T>) => {
      return requestProcess.initialProcessingApis.errors[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
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
      return (
        isInitialProcessingApiLoaded(requestInstance) &&
        !isInitialProcessingApiSuccessed(requestInstance) &&
        !isInitialProcessingApiFailed(requestInstance)
      );
    },
    [isInitialProcessingApiLoaded, isInitialProcessingApiSuccessed, isInitialProcessingApiFailed]
  );

  useEffect(() => {
    function cleanupRequestProccess() {
      cleanRequestProcess();
    }
    window.addEventListener('popstate', cleanupRequestProccess);
    return () => {
      window.removeEventListener('popstate', cleanupRequestProccess);
      cleanRequestProcess();
    };
  }, []);

  return { request, isApiProcessing, isInitialApiProcessing };
}
