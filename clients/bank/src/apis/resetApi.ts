import axios, { AxiosRequestConfig, CreateAxiosDefaults, AxiosInstance } from 'axios';
import { getToken } from '../lib';

export class ResetApi {
  private axiosInstance: AxiosInstance;

  constructor(config: CreateAxiosDefaults = { baseURL: process.env.BANK_SERVICE }) {
    const token = getToken();
    config.headers = { Authorization: `Bearer ${token}` };
    this.axiosInstance = axios.create(config);
  }

  async build<T extends unknown>(config: AxiosRequestConfig<T>) {
    try {
      return this.axiosInstance.request(config);
    } catch (error) {
      throw error;
    }
  }
}
