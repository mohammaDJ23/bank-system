import { Form } from './formConstructor';
import { router } from '../../main';
import { Construct, DefineInputRules } from '../decorators';
import { isPassword, isSamePassword } from '../validations';

@Construct()
export class ResetPassword extends Form {
  @DefineInputRules([isPassword])
  password = '';

  @DefineInputRules([isPassword, isSamePassword])
  confirmedPassword = '';

  token = '';

  constructor() {
    super();
    if (router) {
      this.setToken.bind(Object.assign(router, this));
    }
  }

  setToken() {
    const token = router.currentRoute.value.query.token || '';
    if (token) this.token = token;
  }
}
