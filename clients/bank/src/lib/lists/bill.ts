import { ListObj } from './list';

export interface BillObj {
  id: number;
  amount: string;
  receiver: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export class BillList {
  constructor(
    public list: ListObj<BillObj> = {},
    public page: number = 1,
    public take: number = 10
  ) {
    this.list = list;
    this.take = take;
    this.page = page;
  }
}
