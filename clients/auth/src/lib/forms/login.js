import { Form } from './formConstructor';

export class Login extends Form {
  email = '';

  password = '';

  afterSubmit(context, res) {
    localStorage.setItem('accessToken', res.data.accessToken);
  }
}
