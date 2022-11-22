import { Form } from './formConstructor';
import { router } from '../../main';

export class ResetPassword extends Form {
  password = '';

  confirmedPassword = '';

  token = '';

  beforeSubmit(context) {
    const query = router.currentRoute.value.query || '';

    if (query) this.token = query;
  }

  afterSubmit(context, res) {
    router.push('/auth/login');
  }
}
