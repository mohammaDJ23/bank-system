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
