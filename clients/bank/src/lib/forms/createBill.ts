import { DefineRules, DefineVal, CacheInput } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';

export class CreateBill extends Form {
  @DefineRules([isAmount])
  @DefineVal()
  @CacheInput()
  amount: string = '';

  @DefineRules([isReceiver])
  @DefineVal()
  @CacheInput()
  receiver: string = '';

  @DefineRules([isDescription])
  @DefineVal()
  @CacheInput()
  description: string = '';

  @DefineRules([isDate])
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
