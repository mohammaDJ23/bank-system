import { Notification } from 'element-react';
import {
  AfterSubmition,
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
  firstName: string = '';

  @DefineRules([
    { validator: isLastName, trigger: 'blur' },
    { validator: isLastName, trigger: 'change' },
  ])
  @DefineVal()
  lastName: string = '';

  @DefineRules([
    { validator: isEmail, trigger: 'blur' },
    { validator: isEmail, trigger: 'change' },
  ])
  @DefineVal()
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
  phone: string = '';

  @DefineRules([
    { validator: isRole, trigger: 'blur' },
    { validator: isRole, trigger: 'change' },
  ])
  @DefineVal()
  role: string = '';

  constructor() {
    super();
    this.firstName = this.getCachedInput('firstName');
    this.lastName = this.getCachedInput('lastName');
    this.email = this.getCachedInput('email');
    this.password = this.getCachedInput('password');
    this.phone = this.getCachedInput('phone');
    this.role = this.getCachedInput('role');
  }

  @AfterSubmition()
  showSuccessfulMessage() {
    Notification('Your have created a new user successfully.', 'success');
  }
}
