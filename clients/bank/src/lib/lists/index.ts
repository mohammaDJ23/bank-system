import { UserList } from './user';
import { BillList } from './bill';
import { DeletedUserList } from './deletedUser';
import { DeletedBillList } from './deletedBills';

export * from './bill';
export * from './list';
export * from './user';
export * from './deletedUser';
export * from './deletedBills';

export const lists = {
  UserList,
  BillList,
  DeletedUserList,
  DeletedBillList,
};
