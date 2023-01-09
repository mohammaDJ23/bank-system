import { AxiosRequestConfig } from 'axios';
import {
  CreateBill,
  CreateUser,
  UpdateBill,
  UpdateUserByAdmin,
  UpdateUserByUser,
  ListParams,
} from '../lib';

export enum Apis {
  DEFAULT = 'DEFAULT',
  CREATE_USER = 'CREATE_USER',
  CREATE_BILL = 'CREATE_BILL',
  UPDATE_USER_BY_ADMIN = 'UPDATE_USER_BY_ADMIN',
  UPDATE_USER_BY_USER = 'UPDATE_USER_BY_USER',
  UPDATE_BILL = 'UPDATE_BILL',
  USERS = 'USERS',
  BILLS = 'BILLS',
  USER = 'USER',
  BILL = 'BILL',
  DELETE_BILL = 'DELETE_BILL',
  DELETE_USER = 'DELETE_USER',
}

interface IdReq {
  id: number;
}

abstract class RootApi<D = any> {
  constructor(arg: AxiosRequestConfig<D>) {
    return Object.assign<this, AxiosRequestConfig<D>>(this, arg);
  }
}

export class CreateUserApi extends RootApi<CreateUser> {
  constructor(data: CreateUser) {
    super({
      url: '/user/create',
      method: 'post',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class CreateBillApi extends RootApi<CreateBill> {
  constructor(data: CreateBill) {
    super({
      url: '/bank/bill/create',
      method: 'post',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class UpdateUserByAdminApi extends RootApi<UpdateUserByAdmin> {
  constructor(data: UpdateUserByAdmin) {
    super({
      url: '/user/update/admin',
      method: 'put',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class UpdateUserByUserApi extends RootApi<UpdateUserByUser> {
  constructor(data: UpdateUserByUser) {
    super({
      url: '/user/update',
      method: 'put',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class UpdateBillApi extends RootApi<UpdateBill> {
  constructor(data: UpdateBill) {
    super({
      url: '/bank/bill/update',
      method: 'put',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class UsersApi<T = any> extends RootApi {
  constructor(data: ListParams<T>) {
    super({
      url: `/user/all?page=${data.page}&take=${data.take}`,
      method: 'get',
    });
  }
}

export class BillsApi<T = any> extends RootApi {
  constructor(data: ListParams<T>) {
    super({
      url: `/bank/bills?page=${data.page}&take=${data.take}`,
      method: 'get',
    });
  }
}

export class UserApi extends RootApi {
  constructor(id: number) {
    super({
      url: `/user/${id}`,
      method: 'get',
    });
  }
}

export class BillApi extends RootApi {
  constructor(id: number) {
    super({
      url: `/bank/bill/${id}`,
      method: 'get',
    });
  }
}

export class DeleteBillApi extends RootApi<IdReq> {
  constructor(id: number) {
    super({
      url: `/bank/bill/delete`,
      method: 'delete',
      data: { id },
    });
  }
}

export const apis = {
  [Apis.DEFAULT]() {
    return {};
  },
  [Apis.CREATE_USER](data: CreateUser): AxiosRequestConfig {
    return {
      url: '/user/create',
      method: 'post',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    };
  },
  [Apis.CREATE_BILL](data: CreateBill): AxiosRequestConfig {
    return {
      url: '/bank/bill/create',
      method: 'post',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    };
  },
  [Apis.UPDATE_USER_BY_ADMIN](data: UpdateUserByAdmin): AxiosRequestConfig {
    return {
      url: '/user/update/admin',
      method: 'put',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    };
  },
  [Apis.UPDATE_USER_BY_USER](data: UpdateUserByUser): AxiosRequestConfig {
    return {
      url: '/user/update',
      method: 'put',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    };
  },
  [Apis.UPDATE_BILL](data: UpdateBill): AxiosRequestConfig {
    return {
      url: '/bank/bill/update',
      method: 'put',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    };
  },
  [Apis.USERS]<T>(params: ListParams<T>): AxiosRequestConfig {
    return {
      url: `/user/all?page=${params.page}&take=${params.take}`,
      method: 'get',
    };
  },
  [Apis.BILLS]<T>(params: ListParams<T>): AxiosRequestConfig {
    return {
      url: `/bank/bills?page=${params.page}&take=${params.take}`,
      method: 'get',
    };
  },
  [Apis.USER](id: number): AxiosRequestConfig {
    return {
      url: `/user/${id}`,
      method: 'get',
    };
  },
  [Apis.BILL](id: number): AxiosRequestConfig {
    return {
      url: `/bank/bill/${id}`,
      method: 'get',
    };
  },
  [Apis.DELETE_BILL](id: number): AxiosRequestConfig {
    return {
      url: `/bank/bill/delete`,
      method: 'delete',
      data: { id },
    };
  },
  [Apis.DELETE_USER](id: number): AxiosRequestConfig {
    return {
      url: `/user/delete`,
      method: 'delete',
      data: { id },
    };
  },
};
