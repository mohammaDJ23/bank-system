import { DefineRules } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';

export class UpdateBill extends Form {
  id: number;

  @DefineRules([
    { validator: isAmount, trigger: 'blur' },
    { validator: isAmount, trigger: 'change' },
  ])
  amount: string;

  @DefineRules([
    { validator: isReceiver, trigger: 'blur' },
    { validator: isReceiver, trigger: 'change' },
  ])
  receiver: string;

  @DefineRules([
    { validator: isDescription, trigger: 'blur' },
    { validator: isDescription, trigger: 'change' },
  ])
  description: string;

  @DefineRules([
    { validator: isDate, trigger: 'blur' },
    { validator: isDate, trigger: 'change' },
  ])
  date: Date;

  constructor(arg: Omit<UpdateBill, keyof Form>) {
    super();
    this.id = arg.id;
    this.amount = arg.amount;
    this.receiver = arg.receiver;
    this.description = arg.description;
    this.date = arg.date;
  }
}
