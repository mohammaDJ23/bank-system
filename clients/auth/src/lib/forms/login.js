import { Form } from './formConstructor';
import { isEmail, isPassword } from '../validations';
import { CacheInput, DefineInputRules, Construct } from '../decorators';

@Construct()
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
