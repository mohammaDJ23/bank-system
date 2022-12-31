import { useCallback } from 'react';
import { Apis, Request } from '../apis';
import { useAction } from './useActions';
import { useSelector } from './useSelector';

export function useRequest() {
  const { loadings } = useSelector();
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

  const isApiProcessing = useCallback(
    (apiName: Apis) => {
      return loadings[apiName];
    },
    [loadings]
  );

  const isInitialApiProcessing = useCallback(
    (apiName: Apis) => {
      return loadings[apiName] === undefined || loadings[apiName];
    },
    [loadings]
  );

  return { request, isApiProcessing, isInitialApiProcessing };
}
