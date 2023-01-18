import axios, {
  AxiosRequestConfig,
  CreateAxiosDefaults,
  AxiosInstance,
  AxiosError,
  AxiosResponse,
} from 'axios';
import { getToken } from '../lib';

export interface ErrorObj {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export type RequestParametersType<R = any, D = any> = ConstructorParameters<
  typeof Request<R, D>
>[0];

export interface RootApiObj<D = any> {
  readonly api: AxiosRequestConfig<D>;
  readonly config?: CreateAxiosDefaults<D>;
}

export class Request<R = any, D = any> implements RootApiObj<D> {
  private readonly axiosInstance: AxiosInstance;
  public readonly api: AxiosRequestConfig<D>;
  public readonly config?: CreateAxiosDefaults<D> | undefined;

  constructor({ api, config = {} }: RootApiObj<D>) {
    this.api = api;
    this.config = {
      baseURL: process.env.BANK_SERVICE,
      timeout: 5000,
      headers: { Authorization: `Bearer ${getToken()}` },
      ...config,
    };
    this.axiosInstance = axios.create(this.config);
  }

  async build(): Promise<AxiosResponse<R, D>> {
    try {
      return this.axiosInstance.request<R, AxiosResponse<R>, D>(this.api);
    } catch (error) {
      const err = error as AxiosError<ErrorObj, D>;
      throw err;
    }
  }
}
