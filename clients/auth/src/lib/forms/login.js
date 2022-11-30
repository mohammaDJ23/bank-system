import { decodeToken } from 'react-jwt';
import { Form } from './formConstructor';
import { LocalStorage } from '../';
import { router } from '../../main';
import { ElNotification } from 'element-plus';
import { isMicroFrontEnd } from '../validations';

export class Login extends Form {
  email = '';

  password = '';

  constructor() {
    super();
    this.setCachedInput('email');
  }

  afterSubmit(context, res) {
    const token = res.data.accessToken;
    const decodedToken = decodeToken(token);
    const storableData = [
      ['access_token', token],
      ['access_token_expiration', new Date().getTime() + decodedToken.expiration],
    ];

    for (let [key, value] of storableData) LocalStorage.setItem(key, value);

    if (isMicroFrontEnd()) router.push('/');
    else
      ElNotification({
        title: 'Success',
        message: 'Your are logged in',
        type: 'success',
      });
  }
}
