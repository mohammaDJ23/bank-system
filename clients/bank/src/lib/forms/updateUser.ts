import { DefineRules, isEmail, isFirstName, isLastName, isPhone, isRole } from '../';
import { Form } from './formConstructor';

export class UpdateUserByAdmin extends Form {
  id: number;

  @DefineRules([
    { validator: isFirstName, trigger: 'blur' },
    { validator: isFirstName, trigger: 'change' },
  ])
  firstName: string;

  @DefineRules([
    { validator: isLastName, trigger: 'blur' },
    { validator: isLastName, trigger: 'change' },
  ])
  lastName: string;

  @DefineRules([
    { validator: isEmail, trigger: 'blur' },
    { validator: isEmail, trigger: 'change' },
  ])
  email: string;

  @DefineRules([
    { validator: isPhone, trigger: 'blur' },
    { validator: isPhone, trigger: 'change' },
  ])
  phone: string;

  @DefineRules([
    { validator: isRole, trigger: 'blur' },
    { validator: isRole, trigger: 'change' },
  ])
  role: string;

  constructor(arg: Omit<UpdateUserByAdmin, keyof Form>) {
    super();
    this.id = arg.id;
    this.firstName = arg.firstName;
    this.lastName = arg.lastName;
    this.email = arg.email;
    this.phone = arg.phone;
    this.role = arg.role;
  }
}

export class UpdateUserByUser extends Form {
  id: number;

  @DefineRules([
    { validator: isFirstName, trigger: 'blur' },
    { validator: isFirstName, trigger: 'change' },
  ])
  firstName: string;

  @DefineRules([
    { validator: isLastName, trigger: 'blur' },
    { validator: isLastName, trigger: 'change' },
  ])
  lastName: string;

  @DefineRules([
    { validator: isEmail, trigger: 'blur' },
    { validator: isEmail, trigger: 'change' },
  ])
  email: string;

  @DefineRules([
    { validator: isPhone, trigger: 'blur' },
    { validator: isPhone, trigger: 'change' },
  ])
  phone: string;

  constructor(arg: Omit<UpdateUserByUser, keyof Form>) {
    super();
    this.id = arg.id;
    this.firstName = arg.firstName;
    this.lastName = arg.lastName;
    this.email = arg.email;
    this.phone = arg.phone;
  }
}
