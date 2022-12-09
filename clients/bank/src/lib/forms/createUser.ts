import { DefineRules, isEmail, isFirstName, isLastName, isPassword, isPhone, isRole } from '../';
import { Form } from './formConstructor';

export class CreateUser extends Form {
  @DefineRules([
    { validator: isFirstName, trigger: 'blur' },
    { validator: isFirstName, trigger: 'change' },
  ])
  firstName: string = '';

  @DefineRules([
    { validator: isLastName, trigger: 'blur' },
    { validator: isLastName, trigger: 'change' },
  ])
  lastName: string = '';

  @DefineRules([
    { validator: isEmail, trigger: 'blur' },
    { validator: isEmail, trigger: 'change' },
  ])
  email: string = '';

  @DefineRules([
    { validator: isPassword, trigger: 'blur' },
    { validator: isPassword, trigger: 'change' },
  ])
  password: string = '';

  @DefineRules([
    { validator: isPhone, trigger: 'blur' },
    { validator: isPhone, trigger: 'change' },
  ])
  phone: string = '';

  @DefineRules([
    { validator: isRole, trigger: 'blur' },
    { validator: isRole, trigger: 'change' },
  ])
  role: string = '';
}
