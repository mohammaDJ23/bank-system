import { useState } from 'react';
import { ResetApi, Apis } from '../apis';
import { Notification } from 'element-react';
import { AxiosResponse } from 'axios';

interface Loadings {
  [key: string]: boolean;
}

export function useRequest() {
  const [loadings, setLoading] = useState<Loadings>({});

  function request(apiName: Apis) {
    return async function (data?: any) {
      let response = null;

      try {
        setLoading(prevState => Object.assign({}, prevState, { [apiName]: true }));
        const restApi = new ResetApi();
        response = await restApi.build(data);
      } catch (error) {
        const err = error as AxiosResponse;
        console.log(err);
        Notification({ message: 'something went wrong' }, 'error');
      } finally {
        setLoading(prevState => {
          delete prevState[apiName];
          return Object.assign({}, prevState);
        });
        return response;
      }
    };
  }

  return { request, loadings };
}
