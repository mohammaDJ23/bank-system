import { UserList } from './user';
import { BillList } from './bill';
import { DeletedUserList } from './deletedUsers';
import { DeletedBillList } from './deletedBills';

export * from './bill';
export * from './list';
export * from './user';
export * from './deletedUsers';
export * from './deletedBills';

export const lists = {
  UserList,
  BillList,
  DeletedUserList,
  DeletedBillList,
};
