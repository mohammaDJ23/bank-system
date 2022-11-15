import { Form } from './formConstructor';
import { router } from '../../main';
import { ElNotification } from 'element-plus';

export class Login extends Form {
  email = '';

  password = '';

  afterSubmit(context, res) {
    localStorage.setItem('accessToken', res.data.accessToken);

    if (JSON.parse(process.env.IS_MICRO_FRONT_END)) router.push('/');
    else
      ElNotification({
        title: 'Success',
        message: 'Your are logged in',
        type: 'success',
      });
  }
}
