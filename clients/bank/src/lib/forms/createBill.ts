import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';
import dateFormat from 'dateformat';

export class CreateBill extends Form {
  @DefineRules([isAmount])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  amount: string = '';

  @DefineRules([isReceiver])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  receiver: string = '';

  @DefineRules([isDescription])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  description: string = '';

  @DefineRules([isDate])
  @DefineVal()
  @CacheInput()
  @DefineValidation({ isValid: true })
  date: string = new Date().toISOString();

  constructor() {
    super();
    this.amount = this.getCachedInput('amount');
    this.receiver = this.getCachedInput('receiver');
    this.description = this.getCachedInput('description');
    this.date = dateFormat(this.getCachedInput('date'), 'yyyy-mm-dd');
  }
}
