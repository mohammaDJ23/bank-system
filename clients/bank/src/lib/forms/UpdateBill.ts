import { DefineRules, DefineVal, DefineValidation } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';
import dateFormat from 'dateformat';

export class UpdateBill extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([isAmount])
  @DefineVal()
  @DefineValidation({ isValid: true })
  amount: string = '';

  @DefineRules([isReceiver])
  @DefineVal()
  @DefineValidation({ isValid: true })
  receiver: string = '';

  @DefineRules([isDescription])
  @DefineVal()
  @DefineValidation({ isValid: true })
  description: string = '';

  @DefineRules([isDate])
  @DefineVal()
  @DefineValidation({ isValid: true })
  date: string = new Date().toISOString();

  constructor({
    id = 0,
    amount = '',
    receiver = '',
    description = '',
    date = new Date().toISOString(),
  }: Partial<Omit<UpdateBill, keyof Form>> = {}) {
    super();
    this.id = id;
    this.amount = amount;
    this.receiver = receiver;
    this.description = description;
    this.date = dateFormat(date, 'yyyy-mm-dd');
  }
}
