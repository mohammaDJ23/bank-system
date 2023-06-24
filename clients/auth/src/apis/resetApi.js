import axios from 'axios';

export class Request {
  constructor({ api = {}, config = {} }) {
    this.api = api;
    this.config = {
      baseURL: process.env.AUTH_SERVICE,
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
