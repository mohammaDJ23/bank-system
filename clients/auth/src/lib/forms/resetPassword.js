import { Form } from './formConstructor';
import { router } from '../../main';

export class ResetPassword extends Form {
  password = '';

  confirmedPassword = '';

  token = '';

  beforeSubmit(context) {
    const params = new URLSearchParams(window.location.search);

    if (params.has('token')) this.token = params.get('token');
  }

  afterSubmit(context, res) {
    router.push('/auth/login');
  }
}
