import { useCallback } from 'react';
import { apis, Apis, Req, ResetApi } from '../apis';
import { useAction } from './useActions';
import { useSelector } from './useSelector';

export function useRequest() {
  const { loadings } = useSelector();
  const { asyncOp } = useAction();

  const request = useCallback(
    <D = any, R = any>(req: Req<R, D>) => {
      asyncOp(async (dispatch, store) => {
        req.beforeSubmition(dispatch, store);
        const response = await ResetApi.req<D, R>(
          apis[req.apiName](req.data as D as any),
          req.config
        );
        req.afterSubmition(response as R, dispatch, store);
      }, req.apiName);
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
