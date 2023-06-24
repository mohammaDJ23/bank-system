import { UserList } from './user';
import { BillList } from './bill';
import { DeletedUserList } from './deletedUser';

export * from './bill';
export * from './list';
export * from './user';
export * from './deletedUser';

export const lists = {
  UserList,
  BillList,
  DeletedUserList,
};
