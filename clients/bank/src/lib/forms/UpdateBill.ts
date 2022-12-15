import { DefineRules } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';

export class UpdateBill extends Form {
  id: number = 0;

  @DefineRules([
    { validator: isAmount, trigger: 'blur' },
    { validator: isAmount, trigger: 'change' },
  ])
  amount: string = '';

  @DefineRules([
    { validator: isReceiver, trigger: 'blur' },
    { validator: isReceiver, trigger: 'change' },
  ])
  receiver: string = '';

  @DefineRules([
    { validator: isDescription, trigger: 'blur' },
    { validator: isDescription, trigger: 'change' },
  ])
  description: string = '';

  @DefineRules([
    { validator: isDate, trigger: 'blur' },
    { validator: isDate, trigger: 'change' },
  ])
  date: Date = new Date();

  constructor() {
    super();
    this.id = +this.setPropWithParam('id');
  }
}
