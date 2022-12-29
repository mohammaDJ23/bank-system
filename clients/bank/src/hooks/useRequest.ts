import { AxiosResponse, CreateAxiosDefaults } from 'axios';
import { useCallback } from 'react';
import { apis, Apis, ResetApi } from '../apis';
import { useAction } from './useActions';
import { useSelector } from './useSelector';

interface RequestOptions<D = any, R = any> {
  data: D;
  config: CreateAxiosDefaults<D>;
  callback: (response: AxiosResponse<R, D>) => void;
}

export function useRequest() {
  const { loadings } = useSelector();
  const { asyncOp } = useAction();

  const request = useCallback(
    <D = any, R = any>(
      apiName: Apis,
      {
        data = null as D,
        config = undefined,
        callback = function () {},
      }: Partial<RequestOptions<D, R>> = {}
    ) => {
      asyncOp(async (dispatch, store) => {
        const response = await ResetApi.req<D, R>(apis[apiName](data as D as any), config);
        callback.call({}, response);
      }, apiName);
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
