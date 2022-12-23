import axios, { AxiosRequestConfig, CreateAxiosDefaults, AxiosInstance } from 'axios';
import { getToken } from '../lib';

export class ResetApi {
  create(config: CreateAxiosDefaults): AxiosInstance {
    const token = getToken();

    if (!token) throw new Error('unauthorized');

    config.headers = { Authorization: `Bearer ${token}` };
    return axios.create(config);
  }

  async bankServiceApi<T extends unknown>(config: AxiosRequestConfig<T>) {
    try {
      return this.create({ baseURL: process.env.BANK_SERVICE }).request(config);
    } catch (error) {
      throw error;
    }
  }

  async userServiceApi<T extends unknown>(config: AxiosRequestConfig<T>) {
    try {
      return this.create({ baseURL: process.env.USER_SERVICE }).request(config);
    } catch (error) {
      throw error;
    }
  }
}
