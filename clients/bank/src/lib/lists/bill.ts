import { ListInstance, ListObj } from './list';

export interface BillObj {
  id: string;
  amount: string;
  receiver: string;
  description: string;
  date: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: number;
}

export interface BillFiltersObj {
  q: string;
  date: string;
  fromDate: string;
  toDate: string;
}

export class BillList implements ListInstance {
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
