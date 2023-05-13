import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { isDate } from '../validations';
import { Form } from './formConstructor';

export class BillListFilters extends Form {
  @DefineVal()
  @DefineValidation()
  q: string = '';

  @DefineRules([isDate])
  @DefineVal()
  @DefineValidation()
  fromDate: number = 0;

  @DefineRules([isDate])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  toDate: number = 0;

  constructor() {
    super();
    this.q = this.q;
    this.fromDate = this.fromDate;
    this.toDate = this.toDate;
  }
}
