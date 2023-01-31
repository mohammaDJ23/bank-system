import axios from 'axios';

export class ResetApi {
  async build(config) {
    try {
      const res = await axios.create({ baseURL: process.env.AUTH_SERVICE }).request(config);
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export class Request {
  constructor({ api = {}, config = {} }) {
    this.api = api;
    this.config = {
      baseURL: process.env.AUTH_SERVICE,
      timeout: 5000,
      ...config,
    };
    this.axiosInstance = axios.create(this.config);
  }

  async build() {
    try {
      return this.axiosInstance.request(this.api);
    } catch (error) {
      throw error;
    }
  }
}
