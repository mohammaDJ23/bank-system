import { CreateUser } from './createUser';
import { CreateBill } from './createBill';
import { UpdateBill } from './updateBill';
import { UpdateUserByAdmin } from './updateUser';
import { UpdateUserByUser } from './updateUser';

export * from './createUser';
export * from './formConstructor';
export * from './updateUser';
export * from './createBill';
export * from './updateBill';

export const forms = {
  CreateUser,
  CreateBill,
  UpdateBill,
  UpdateUserByAdmin,
  UpdateUserByUser,
};
