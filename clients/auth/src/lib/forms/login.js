import { Form } from './formConstructor';
import { router } from '../../main';
import { ElNotification } from 'element-plus';
import { isMicroFrontEnd } from '../validations';

export class Login extends Form {
  email = '';

  password = '';

  afterSubmit(context, res) {
    document.cookie = `access_token=${res.data.accessToken}`;

    if (isMicroFrontEnd()) router.push('/');
    else
      ElNotification({
        title: 'Success',
        message: 'Your are logged in',
        type: 'success',
      });
  }
}
