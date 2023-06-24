import { UserRoles } from '../auth';
import { DefineRules, DefineVal, CacheInput, DefineValidation } from '../decorators';
import { isDate, isUserRoles } from '../validations';
import { Form } from './formConstructor';

export class DeletedUserListFilters extends Form {
  @DefineVal()
  @DefineValidation()
  q: string = '';

  @DefineRules([isUserRoles])
  @DefineVal(Object.values(UserRoles))
  @DefineValidation()
  roles: UserRoles[] = Object.values(UserRoles);

  @DefineRules([isDate])
  @DefineVal()
  @DefineValidation()
  fromDate: number = 0;

  @DefineRules([isDate])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  toDate: number = 0;

  @DefineRules([isDate])
  @DefineVal()
  @CacheInput()
  @DefineValidation()
  deletedDate: number = 0;

  constructor() {
    super();
    this.q = this.q;
    this.roles = this.roles;
    this.fromDate = this.fromDate;
    this.toDate = this.toDate;
    this.deletedDate = this.deletedDate;
  }
}
