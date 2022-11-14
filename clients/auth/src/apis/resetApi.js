import axios from 'axios';

export class ResetApi {
  async build({ url, method, ...config }) {
    try {
      const res = await axios[method](url, config);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
