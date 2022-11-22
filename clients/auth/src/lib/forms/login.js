import { decodeToken } from 'react-jwt';
import { Form } from './formConstructor';
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
    const decodedToken = decodeToken(res.data.accessToken);
    document.cookie = `access_token=${res.data.accessToken}`;
    document.cookie = `access_token_expiration=${new Date().getTime() + decodedToken.expiration}`;

    if (isMicroFrontEnd()) router.push('/');
    else
      ElNotification({
        title: 'Success',
        message: 'Your are logged in',
        type: 'success',
      });
  }
}
