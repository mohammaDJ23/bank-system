import { AxiosError, AxiosResponse } from 'axios';
import { Notification } from 'element-react';
import { useCallback, useEffect } from 'react';
import { ErrorObj, Request, RequestParametersType, RootApiObj } from '../apis';
import { Constructor } from '../lib';
import { useAction } from './useActions';
import { useSelector } from './useSelector';

export function useRequest() {
  const { requestProcess } = useSelector();
  const { cleanRequestProcess, loading, success, error } = useAction();

  const getRequestConstructorName = useCallback(
    <T extends RootApiObj>(requestInstance: RequestParametersType | Constructor<T>) => {
      if (typeof requestInstance === 'function') return requestInstance.name;
      else return requestInstance.constructor.name;
    },
    []
  );

  const request = useCallback(
    async <R = any, D = any>(
      requestInstance: RequestParametersType<R, D>
    ): Promise<AxiosResponse<R, D>> => {
      const requestConstructorName = getRequestConstructorName(requestInstance);
      try {
        loading(requestConstructorName);
        const request = new Request<R, D>(requestInstance);
        const response = await request.build();
        success(requestConstructorName);
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
        Notification(message, 'error');
        error(requestConstructorName);
        throw err;
      }
    },
    [loading, success, error, getRequestConstructorName]
  );

  const isRequestProccessing = useCallback(
    <T extends RootApiObj>(requestInstance: Constructor<T>) => {
      return requestProcess.loadings[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isRequestSuccess = useCallback(
    <T extends RootApiObj>(requestInstance: Constructor<T>) => {
      return requestProcess.successes[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isRequestFailed = useCallback(
    <T extends RootApiObj>(requestInstance: Constructor<T>) => {
      return requestProcess.errors[getRequestConstructorName(requestInstance)];
    },
    [requestProcess, getRequestConstructorName]
  );

  const isApiProcessing = useCallback(
    <T extends RootApiObj>(requestInstance: Constructor<T>) => {
      return (
        isRequestProccessing(requestInstance) &&
        !isRequestFailed(requestInstance) &&
        !isRequestSuccess(requestInstance)
      );
    },
    [isRequestProccessing, isRequestFailed, isRequestSuccess]
  );

  const isInitialApiProcessing = useCallback(
    <T extends RootApiObj>(requestInstance: Constructor<T>) => {
      const proccessingRequest = isRequestProccessing(requestInstance);
      return (
        (!proccessingRequest &&
          !isRequestFailed(requestInstance) &&
          !isRequestSuccess(requestInstance)) ||
        proccessingRequest
      );
    },
    [isRequestProccessing, isRequestFailed, isRequestSuccess]
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
