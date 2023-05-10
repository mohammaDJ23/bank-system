import { ListInstance, ListObj } from './list';
import { UserRoles } from '../auth';

export interface UserObj {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRoles;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithBillInfoObj extends UserObj {
  bill: {
    counts: string;
    amounts: string;
  };
}

export interface UserFiltersObj {
  q: string;
  role: string;
  fromDate: string;
  toDate: string;
}

export class UserList implements ListInstance {
  constructor(
    public list: ListObj<UserObj> = {},
    public total: number = 0,
    public page: number = 1,
    public take: number = 10
  ) {
    this.list = list;
    this.take = take;
    this.page = page;
    this.total = total;
  }
}
