import { Form } from './formConstructor';
import { router } from '../../main';
import { DefineInputRules } from '../decorators';
import { isPassword, isSamePassword } from '../validations';

export class ResetPassword extends Form {
  @DefineInputRules([isPassword])
  password = '';

  @DefineInputRules([isPassword, isSamePassword])
  confirmedPassword = '';

  token = '';

  constructor() {
    super();
    this.setToken.bind(Object.assign(router, this));
  }

  setToken() {
    const token = router.currentRoute.value.query.token || '';
    if (token) this.token = token;
  }
}
