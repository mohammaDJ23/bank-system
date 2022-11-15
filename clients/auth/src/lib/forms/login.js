import { Form } from './formConstructor';
import { router } from '../../main';

export class Login extends Form {
  email = '';

  password = '';

  afterSubmit(context, res) {
    localStorage.setItem('accessToken', res.data.accessToken);
    router.push('/');
  }
}
