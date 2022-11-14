import axios from 'axios';

export class ResetApi {
  async build({ url, method, ...config }) {
    const res = await axios[method](url, config);
    return res;
  }
}
