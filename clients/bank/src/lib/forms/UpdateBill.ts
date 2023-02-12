import { DefineRules, DefineVal } from '../decorators';
import { isReceiver, isAmount, isDescription, isDate } from '../validations';
import { Form } from './formConstructor';

export class UpdateBill extends Form {
  @DefineVal()
  id: number = 0;

  @DefineRules([isAmount])
  @DefineVal()
  amount: string = '';

  @DefineRules([isReceiver])
  @DefineVal()
  receiver: string = '';

  @DefineRules([isDescription])
  @DefineVal()
  description: string = '';

  @DefineRules([isDate])
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
    this.id = id;
    this.amount = amount;
    this.receiver = receiver;
    this.description = description;
    this.date = date;
  }
}
