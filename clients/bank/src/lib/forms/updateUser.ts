import {
  DefineRules,
  DefineVal,
  isEmail,
  isFirstName,
  isLastName,
  isPhone,
  isRole,
  UserRoles,
} from '../';
import { Form } from './formConstructor';

export class UpdateUserByAdmin extends Form {
  @DefineVal()
  id: number = 0;

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
    { validator: isPhone, trigger: 'blur' },
    { validator: isPhone, trigger: 'change' },
  ])
  @DefineVal()
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
