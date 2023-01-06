import { useCallback } from 'react';
import { Apis, Request } from '../apis';
import { useAction } from './useActions';
import { useSelector } from './useSelector';

export function useRequest() {
  const { requestProcess } = useSelector();
  const { asyncOp } = useAction();

  const request = useCallback(
    <R = any, D = any>(req: Partial<Request<R, D>>) => {
      asyncOp(async (dispatch, store) => {
        if (req.beforeRequest) req.beforeRequest(dispatch, store);
        const request = new Request<R, D>(req);
        const response = await request.build();
        if (req.afterRequest) req.afterRequest(response, dispatch, store);
      }, req.apiName || Apis.DEFAULT);
    },
    [asyncOp]
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

  return { request, isApiProcessing, isInitialApiProcessing };
}
