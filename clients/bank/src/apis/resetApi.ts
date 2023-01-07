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

export type RequestParametersType<R, D> = ConstructorParameters<typeof Request<R, D>>[0];

export class Request<R = any, D = any> {
  private readonly axiosInstance: AxiosInstance;
  public readonly apiName: Apis;
  public readonly data: AxiosRequestConfig<D>;
  public readonly config?: CreateAxiosDefaults<D>;
  public readonly beforeRequest?: (dispatch: Dispatch<RootActions>, store: RootState) => void;
  public readonly afterRequest?: (
    response: AxiosResponse<R, D>,
    dispatch: Dispatch<RootActions>,
    store: RootState
  ) => void;

  constructor({
    apiName,
    data,
    config = {},
    beforeRequest = (dispatch, store) => {},
    afterRequest = (response, dispatch, store) => {},
  }: Omit<Request, 'axiosInstance' | 'build'>) {
    this.apiName = apiName;
    this.data = data;
    this.config = {
      baseURL: process.env.BANK_SERVICE,
      timeout: 5000,
      headers: { Authorization: `Bearer ${getToken()}` },
      ...config,
    };
    this.axiosInstance = axios.create(this.config);
    this.beforeRequest = beforeRequest;
    this.afterRequest = afterRequest;
  }

  async build(): Promise<AxiosResponse<R, D>> {
    try {
      return this.axiosInstance.request<R, AxiosResponse<R>, D>(this.data);
    } catch (error) {
      const err = error as AxiosError<ErrorObj>;
      throw err;
    }
  }
}
