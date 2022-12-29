import { CreateAxiosDefaults } from 'axios';
import { useCallback } from 'react';
import { apis, Apis, ResetApi } from '../apis';
import { asyncOp } from '../store/actions';
import { useSelector } from './useSelector';

interface RequestOptions<D = any, R = any> {
  data: D;
  config: CreateAxiosDefaults<D>;
  callback: (response: R) => void;
}

export function useRequest() {
  const { loadings } = useSelector();

  const request = useCallback(
    <D = any, R = any>(
      apiName: Apis,
      options: RequestOptions<D, R> = { data: null as D, config: {}, callback<R>(response: R) {} }
    ) => {
      asyncOp(async (dispatch, store) => {
        const response = await ResetApi.req<D, R>(
          apis[apiName](options.data as D as any),
          options.config
        );
        options.callback.call({}, response as R);
      }, apiName);
    },
    []
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
