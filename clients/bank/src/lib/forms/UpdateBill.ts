import { Notification } from 'element-react';
import type { Dispatch } from 'redux';
import type { RootState } from '../../store';
import { RootActions } from '../../store/actions';
import { AfterSubmition, DefineRules, DefineVal } from '../decorators';
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
    super({ shouldCachInput: false });
    this.id = id;
    this.amount = amount;
    this.receiver = receiver;
    this.description = description;
    this.date = date;
  }

  @AfterSubmition()
  afterUpdating(dispatch: Dispatch<RootActions>, store: RootState) {
    Notification('You have updated the bill successfully.', 'success');
    if (store.history) store.history.push(`/bank/bills/${this.id}`);
  }
}
