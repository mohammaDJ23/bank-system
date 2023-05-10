import { CreateUser } from './createUser';
import { CreateBill } from './createBill';
import { UpdateBill } from './updateBill';
import { UpdateUserByOwner } from './updateUser';
import { UpdateUser } from './updateUser';
import { UserFilters } from './userFilters';

export * from './createUser';
export * from './formConstructor';
export * from './updateUser';
export * from './createBill';
export * from './updateBill';
export * from './userFilters';

export const forms = {
  CreateUser,
  CreateBill,
  UpdateBill,
  UpdateUserByOwner,
  UpdateUser,
  UserFilters,
};
