import {
  DefineRules,
  DefineVal,
  isEmail,
  isFirstName,
  isLastName,
  isPhone,
  isRole,
  UserRoles,
  DefineValidation,
} from '../';
import { Form } from './formConstructor';

export class UpdateUserByAdmin extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([isFirstName])
  @DefineVal()
  @DefineValidation()
  firstName: string = '';

  @DefineRules([isLastName])
  @DefineVal()
  @DefineValidation()
  lastName: string = '';

  @DefineRules([isEmail])
  @DefineVal()
  @DefineValidation()
  email: string = '';

  @DefineRules([isPhone])
  @DefineVal()
  @DefineValidation()
  phone: string = '';

  @DefineRules([isRole])
  @DefineVal()
  @DefineValidation()
  role: UserRoles = UserRoles.USER;

  constructor({
    id = 0,
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    role = UserRoles.USER,
  }: Partial<Omit<UpdateUserByAdmin, keyof Form>> = {}) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.role = role;
  }
}

export class UpdateUserByUser extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([isFirstName])
  @DefineVal()
  @DefineValidation()
  firstName: string = '';

  @DefineRules([isLastName])
  @DefineVal()
  @DefineValidation()
  lastName: string = '';

  @DefineRules([isEmail])
  @DefineVal()
  @DefineValidation()
  email: string = '';

  @DefineRules([isPhone])
  @DefineVal()
  @DefineValidation()
  phone: string = '';

  constructor({
    id = 0,
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
  }: Partial<Omit<UpdateUserByUser, keyof Form>> = {}) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }
}
