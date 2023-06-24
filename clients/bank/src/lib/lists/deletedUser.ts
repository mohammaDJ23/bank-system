import { ListInstance, ListObj } from './list';
import { UserObj } from './user';

export class DeletedUserList implements ListInstance {
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
