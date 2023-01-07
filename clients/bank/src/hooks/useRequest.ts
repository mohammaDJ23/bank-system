import { AxiosError, AxiosResponse } from 'axios';
import { Notification } from 'element-react';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Apis, ErrorObj, Request } from '../apis';
import { useAction } from './useActions';
import { useSelector } from './useSelector';

export function useRequest() {
  const { requestProcess } = useSelector();
  const { cleanRequestProcess, loading, success, error } = useAction();
  const dispatch = useDispatch();
  const state = useSelector();

  const request = useCallback(
    async <R = any, D = any>(
      req: ConstructorParameters<typeof Request<R, D>>[0]
    ): Promise<AxiosResponse<R, D> | AxiosError<ErrorObj> | Error> => {
      try {
        loading(req.apiName);
        if (req.beforeRequest) req.beforeRequest(dispatch, state);
        const request = new Request<R, D>(req);
        const response = await request.build();
        if (req.afterRequest) req.afterRequest(response, dispatch, state);
        success(req.apiName);
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
        error(req.apiName);
        return err;
      }
    },
    [loading, success, error, dispatch, state]
  );

  const isRequestProccessing = useCallback(
    (apiName: Apis) => {
      return requestProcess.loadings[apiName];
    },
    [requestProcess]
  );

  const isRequestSuccess = useCallback(
    (apiName: Apis) => {
      return requestProcess.successes[apiName];
    },
    [requestProcess]
  );

  const isRequestFailed = useCallback(
    (apiName: Apis) => {
      return requestProcess.errors[apiName];
    },
    [requestProcess]
  );

  const isApiProcessing = useCallback(
    (apiName: Apis) => {
      return (
        isRequestProccessing(apiName) && !isRequestFailed(apiName) && !isRequestSuccess(apiName)
      );
    },
    [isRequestProccessing, isRequestFailed, isRequestSuccess]
  );

  const isInitialApiProcessing = useCallback(
    (apiName: Apis) => {
      const proccessingRequest = isRequestProccessing(apiName);
      return (
        (!proccessingRequest && !isRequestFailed(apiName) && !isRequestSuccess(apiName)) ||
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
