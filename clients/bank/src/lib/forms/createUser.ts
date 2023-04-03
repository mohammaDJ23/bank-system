import {
  CacheInput,
  DefineRules,
  DefineVal,
  DefineValidation,
  isEmail,
  isFirstName,
  isLastName,
  isPassword,
  isPhone,
  isRole,
} from '../';
import { Form } from './formConstructor';

export class CreateUser extends Form {
  @DefineRules([isFirstName])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  firstName: string = '';

  @DefineRules([isLastName])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  lastName: string = '';

  @DefineRules([isEmail])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  email: string = '';

  @DefineRules([isPassword])
  @DefineVal()
  @DefineValidation()
  password: string = '';

  @DefineRules([isPhone])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  phone: string = '';

  @DefineRules([isRole])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  role: string = '';

  constructor() {
    super();
    this.firstName = this.getCachedInput('firstName');
    this.lastName = this.getCachedInput('lastName');
    this.email = this.getCachedInput('email');
    this.password = this.password;
    this.phone = this.getCachedInput('phone');
    this.role = this.getCachedInput('role');
  }
}
