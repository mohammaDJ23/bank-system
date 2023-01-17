import {
  CacheInput,
  DefineRules,
  DefineVal,
  isEmail,
  isFirstName,
  isLastName,
  isPassword,
  isPhone,
  isRole,
} from '../';
import { Form } from './formConstructor';

export class CreateUser extends Form {
  @DefineRules([
    { validator: isFirstName, trigger: 'blur' },
    { validator: isFirstName, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  firstName: string = '';

  @DefineRules([
    { validator: isLastName, trigger: 'blur' },
    { validator: isLastName, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  lastName: string = '';

  @DefineRules([
    { validator: isEmail, trigger: 'blur' },
    { validator: isEmail, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  email: string = '';

  @DefineRules([
    { validator: isPassword, trigger: 'blur' },
    { validator: isPassword, trigger: 'change' },
  ])
  @DefineVal()
  password: string = '';

  @DefineRules([
    { validator: isPhone, trigger: 'blur' },
    { validator: isPhone, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  phone: string = '';

  @DefineRules([
    { validator: isRole, trigger: 'blur' },
    { validator: isRole, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  role: string = '';

  constructor() {
    super();
    this.firstName = this.getCachedInput('firstName');
    this.lastName = this.getCachedInput('lastName');
    this.email = this.getCachedInput('email');
    this.password = '';
    this.phone = this.getCachedInput('phone');
    this.role = this.getCachedInput('role');
  }
}
