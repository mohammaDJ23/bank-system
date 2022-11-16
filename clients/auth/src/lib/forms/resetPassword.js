import { Form } from './formConstructor';
import { router } from '../../main';

export class ResetPassword extends Form {
  password = '';

  confirmedPassword = '';

  token = '';

  afterSubmit(context, res) {
    router.push('/auth/login');
  }
}
