import { DefineRules, DefineVal, CacheInput } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';

export class CreateBill extends Form {
  @DefineRules([
    { validator: isAmount, trigger: 'blur' },
    { validator: isAmount, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  amount: string = '';

  @DefineRules([
    { validator: isReceiver, trigger: 'blur' },
    { validator: isReceiver, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  receiver: string = '';

  @DefineRules([
    { validator: isDescription, trigger: 'blur' },
    { validator: isDescription, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  description: string = '';

  @DefineRules([
    { validator: isDate, trigger: 'blur' },
    { validator: isDate, trigger: 'change' },
  ])
  @DefineVal()
  @CacheInput()
  date: Date = new Date();

  constructor() {
    super();
    this.amount = this.getCachedInput('amount');
    this.receiver = this.getCachedInput('receiver');
    this.description = this.getCachedInput('description');
    this.date = this.getCachedInput('date');
  }
}
