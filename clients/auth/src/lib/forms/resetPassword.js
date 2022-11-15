import { Form } from './formConstructor';
import { isMicroFrontEnd } from '../../lib';
import { router } from '../../main';

export class ResetPassword extends Form {
  password = '';

  confirmedPassword = '';

  afterSubmit(context, res) {
    router.push('/auth/login');
  }
}
