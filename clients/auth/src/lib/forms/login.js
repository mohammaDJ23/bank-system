import { Form } from './formConstructor';
import { isEmail, isPassword } from '../validations';
import { CacheInput, DefineInputRules } from '../decorators';

export class Login extends Form {
  @DefineInputRules([isEmail])
  @CacheInput()
  email = '';

  @DefineInputRules([isPassword])
  password = '';

  constructor() {
    super();
    this.email = this.getCachedInput('email');
  }
}
