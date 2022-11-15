import { Form } from './formConstructor';
import { router } from '../../main';

export class ResetPassword extends Form {
  password = '';

  confirmedPassword = '';

  afterSubmit(context, res) {
    router.push('/auth/login');
  }
}
