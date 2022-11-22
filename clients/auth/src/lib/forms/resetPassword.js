import { Form } from './formConstructor';
import { router } from '../../main';

export class ResetPassword extends Form {
  password = '';

  confirmedPassword = '';

  token = '';

  constructor() {
    super();

    const token = router.currentRoute.value.query.token || '';
    if (token) this.token = token;
  }

  afterSubmit(context, res) {
    router.push('/auth/login');
  }
}
