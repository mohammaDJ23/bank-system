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
  @DefineRules([isFirstName])
  @DefineVal()
  @CacheInput()
  firstName: string = '';

  @DefineRules([isLastName])
  @DefineVal()
  @CacheInput()
  lastName: string = '';

  @DefineRules([isEmail])
  @DefineVal()
  @CacheInput()
  email: string = '';

  @DefineRules([isPassword])
  @DefineVal()
  password: string = '';

  @DefineRules([isPhone])
  @DefineVal()
  @CacheInput()
  phone: string = '';

  @DefineRules([isRole])
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
