import { Form } from './formConstructor';
import { CacheInput, DefineInputRules } from '../decorators';
import { isEmail } from '../validations';

export class ForgotPassword extends Form {
  @DefineInputRules([isEmail])
  @CacheInput()
  email = '';

  constructor() {
    super();
    this.email = this.getCachedInput('email');
  }
}
