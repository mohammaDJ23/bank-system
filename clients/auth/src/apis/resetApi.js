import axios from 'axios';

export class ResetApi {
  async build({ url, method, ...config }) {
    try {
      const res = await axios[method](process.env.AUTH_SERVICE + url, config);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
