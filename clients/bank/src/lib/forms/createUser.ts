import { Form } from './formConstructor';

export class CreateUser extends Form {
  firstName: string = '';

  lastName: string = '';

  email: string = '';

  password: string = '';

  phone: string = '';

  role: string = '';
}
