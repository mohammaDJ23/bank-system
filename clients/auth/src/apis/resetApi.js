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
