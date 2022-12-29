import { DefineRules, DefineVal } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';

export class UpdateBill extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([
    { validator: isAmount, trigger: 'blur' },
    { validator: isAmount, trigger: 'change' },
  ])
  @DefineVal()
  amount: string = '';

  @DefineRules([
    { validator: isReceiver, trigger: 'blur' },
    { validator: isReceiver, trigger: 'change' },
  ])
  @DefineVal()
  receiver: string = '';

  @DefineRules([
    { validator: isDescription, trigger: 'blur' },
    { validator: isDescription, trigger: 'change' },
  ])
  @DefineVal()
  description: string = '';

  @DefineRules([
    { validator: isDate, trigger: 'blur' },
    { validator: isDate, trigger: 'change' },
  ])
  @DefineVal()
  date: Date = new Date();

  constructor({
    id = 0,
    amount = '',
    receiver = '',
    description = '',
    date = new Date(),
  }: Partial<Omit<UpdateBill, keyof Form>> = {}) {
    super();
    this.id = id || this.getCachedInput('id');
    this.amount = amount || this.getCachedInput('amount');
    this.receiver = receiver || this.getCachedInput('receiver');
    this.description = description || this.getCachedInput('description');
    this.date = date || this.getCachedInput('date');
  }
}
