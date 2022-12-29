import axios, {
  AxiosRequestConfig,
  CreateAxiosDefaults,
  AxiosInstance,
  AxiosError,
  AxiosResponse,
} from 'axios';
import { Dispatch } from 'redux';
import { getToken } from '../lib';
import { RootState } from '../store';
import { RootActions } from '../store/actions';
import { Apis } from './api';

export interface ErrorObj {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export class Req<R = any, D = any> {
  public readonly apiName: Apis;
  public readonly data: D;
  public readonly config: CreateAxiosDefaults<D>;
  public readonly beforeRequest: (dispatch: Dispatch<RootActions>, store: RootState) => void;
  public readonly afterRequest: (
    response: R,
    dispatch: Dispatch<RootActions>,
    store: RootState
  ) => void;

  constructor({
    apiName = Apis.DEFAULT,
    data = {},
    config = {
      baseURL: process.env.BANK_SERVICE,
      timeout: 5000,
      headers: { Authorization: `Bearer ${getToken()}` },
    },
    beforeRequest = (dispatch, store) => {},
    afterRequest = (response, dispatch, store) => {},
  }: Partial<Req> = {}) {
    this.apiName = apiName;
    this.data = data;
    this.config = config;
    this.beforeRequest = beforeRequest;
    this.afterRequest = afterRequest;
  }
}

export class ResetApi {
  private axiosInstance: AxiosInstance;

  constructor(config: CreateAxiosDefaults = { baseURL: process.env.BANK_SERVICE }) {
    const token = getToken();
    config.headers = { Authorization: `Bearer ${token}` };
    this.axiosInstance = axios.create(config);
  }

  async build<T extends any = any, K extends any = any>(
    config: AxiosRequestConfig<T>
  ): Promise<AxiosResponse<K, T>> {
    try {
      return this.axiosInstance.request(config);
    } catch (error) {
      const err = error as AxiosError<ErrorObj>;
      throw err;
    }
  }

  static req<T = any, K = any>(
    req: AxiosRequestConfig<T>,
    config?: CreateAxiosDefaults<T>
  ): Promise<AxiosResponse<K, T>> {
    const restApi = new ResetApi(config);
    return restApi.build<T, K>(req);
  }
}
