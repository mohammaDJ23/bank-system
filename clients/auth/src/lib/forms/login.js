import { decodeToken } from 'react-jwt';
import { Form } from './formConstructor';
import { LocalStorage } from '../';
import { router } from '../../main';
import { notification } from 'ant-design-vue';
import { isEmail, isMicroFrontEnd, isPassword } from '../validations';
import { CacheInput, DefineInputRules } from '../decorators';

export class Login extends Form {
  @DefineInputRules([isEmail])
  @CacheInput()
  email = '';

  @DefineInputRules([isPassword])
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
