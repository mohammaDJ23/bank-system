import { ListInstance, ListObj } from './list';
import { UserRoles } from '../auth';

export interface UserObj {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRoles;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserWithBillInfoObj extends UserObj {
  bill: {
    counts: string;
    amounts: string;
  };

  parent: UserObj;

  users: {
    quantities: string;
  };
}

export interface DeletedUserObj extends UserObj {
  parent: UserObj;
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
