import { decodeToken } from 'react-jwt';
import { Form } from './formConstructor';
import { LocalStorage } from '../';
import { router } from '../../main';
import { notification } from 'ant-design-vue';
import { isMicroFrontEnd } from '../validations';
import { CacheInput } from '../decorators';

export class Login extends Form {
  @CacheInput()
  email = '';

  password = '';

  constructor() {
    super();
    this.email = this.getCachedInput('email');
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
      notification.success({
        message: 'Success',
        description: 'Your are logged in',
      });
  }
}
