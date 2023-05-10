import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { UserFiltersObj } from '../lists';
import { getTime } from '../utilFunctions';
import { isDate, isQuery, isRole } from '../validations';
import { Form } from './formConstructor';

export class UserFilters extends Form implements UserFiltersObj {
  @DefineRules([isQuery])
  @DefineVal()
  @DefineValidation()
  q: string = '';

  @DefineRules([isRole])
  @DefineVal()
  @DefineValidation()
  role: string = '';

  @DefineRules([isDate])
  @DefineVal()
  @DefineValidation()
  fromDate: string = '';

  @DefineRules([isDate])
  @DefineVal(getTime())
  @CacheInput()
  @DefineValidation()
  toDate: string = '';

  constructor() {
    super();
    this.q = this.q;
    this.role = this.role;
    this.fromDate = this.fromDate;
    this.toDate = this.toDate;
  }
}
