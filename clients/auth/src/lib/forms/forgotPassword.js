import { Form } from './formConstructor';
import { CacheInput, DefineInputRules, Construct } from '../decorators';
import { isEmail } from '../validations';

@Construct()
export class ForgotPassword extends Form {
  @DefineInputRules([isEmail])
  @CacheInput()
  email = '';

  constructor() {
    super();
    this.email = this.getCachedInput('email');
  }
}
