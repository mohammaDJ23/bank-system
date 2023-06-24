import { BillObj } from './bill';
import { ListInstance, ListObj } from './list';

export class DeletedBillList implements ListInstance {
  constructor(
    public list: ListObj<BillObj> = {},
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
