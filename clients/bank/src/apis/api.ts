import { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import {
  CreateBill,
  CreateUser,
  UpdateBill,
  UpdateUserByOwner,
  UpdateUser,
  ListParams,
  UserListFilters,
  BillListFilters,
  DeletedUserListFilters,
  DeletedBillListFilters,
} from '../lib';
import { PeriodAmountFilter } from '../store';
import { RootApiObj } from './resetApi';

export abstract class RootApi<D = any> implements RootApiObj<D> {
  protected _isInitialApi: boolean = false;

  constructor(public readonly api: AxiosRequestConfig<D>, public readonly config: CreateAxiosDefaults<D> = {}) {
    this.api = api;
    this.config = config;
  }

  get isInitialApi() {
    return this._isInitialApi;
  }

  setInitialApi(value: boolean = true) {
    this._isInitialApi = value;
    return this;
  }
}

export class CreateUserApi extends RootApi<CreateUser> {
  constructor(data: CreateUser) {
    super(
      {
        url: '/api/v1/user/create',
        method: 'post',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class CreateBillApi extends RootApi<CreateBill> {
  constructor(data: CreateBill) {
    super(
      {
        url: '/api/v1/bank/bill/create',
        method: 'post',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UpdateUserByOwnerApi extends RootApi<UpdateUserByOwner> {
  constructor(data: UpdateUserByOwner) {
    super(
      {
        url: '/api/v1/user/owner/update',
        method: 'put',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class UpdateUserApi extends RootApi<UpdateUser> {
  constructor(data: UpdateUser) {
    super(
      {
        url: '/api/v1/user/update',
        method: 'put',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class UpdateBillApi extends RootApi<UpdateBill> {
  constructor(data: UpdateBill) {
    super(
      {
        url: '/api/v1/bank/bill/update',
        method: 'put',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UsersApi<T = any> extends RootApi {
  constructor(data: ListParams<T> & UserListFilters) {
    super(
      {
        url: '/api/v1/user/all',
        method: 'get',
        params: {
          page: data.page,
          take: data.take,
          filters: {
            q: data.q,
            roles: data.roles,
            fromDate: data.fromDate,
            toDate: data.toDate,
          },
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export type UsersApiConstructorType = ConstructorParameters<typeof UsersApi>[0] & Pick<RootApi, 'isInitialApi'>;

export class DeletedUsersApi<T = any> extends RootApi {
  constructor(data: ListParams<T> & DeletedUserListFilters) {
    super(
      {
        url: '/api/v1/user/all/deleted',
        method: 'get',
        params: {
          page: data.page,
          take: data.take,
          filters: {
            q: data.q,
            roles: data.roles,
            fromDate: data.fromDate,
            toDate: data.toDate,
            deletedDate: data.deletedDate,
          },
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export type DeletedUsersApiConstructorType = ConstructorParameters<typeof DeletedUsersApi>[0] &
  Pick<RootApi, 'isInitialApi'>;

export class BillsApi<T = any> extends RootApi {
  constructor(data: ListParams<T> & BillListFilters) {
    super(
      {
        url: '/api/v1/bank/bill/all',
        method: 'get',
        params: {
          page: data.page,
          take: data.take,
          filters: {
            q: data.q,
            fromDate: data.fromDate,
            toDate: data.toDate,
          },
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type BillsApiConstructorType = ConstructorParameters<typeof BillsApi>[0] & Pick<RootApi, 'isInitialApi'>;

export class DeletedBillListApi<T = any> extends RootApi {
  constructor(data: ListParams<T> & DeletedBillListFilters) {
    super(
      {
        url: '/api/v1/bank/bill/all/deleted',
        method: 'get',
        params: {
          page: data.page,
          take: data.take,
          filters: {
            q: data.q,
            fromDate: data.fromDate,
            toDate: data.toDate,
            deletedDate: data.deletedDate,
          },
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export type DeletedBillListApiConstructorType = ConstructorParameters<typeof DeletedBillListApi>[0] &
  Pick<RootApi, 'isInitialApi'>;

export class UserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/user/${id}`,
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class DeletedUserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/user/${id}/deleted`,
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class RestoreUserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/user/${id}/restore`,
        method: 'post',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class BillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeletedBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/${id}/deleted`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: '/api/v1/bank/bill/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class RestoreBillApi extends RootApi {
  constructor(id: string) {
    super(
      {
        url: `/api/v1/bank/bill/${id}/restore`,
        method: 'post',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DeleteUserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/user/delete',
        method: 'delete',
        params: {
          id,
        },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class TotalAmountApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/total-amount',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class PeriodAmountApi extends RootApi<PeriodAmountFilter> {
  constructor(data: PeriodAmountFilter) {
    super(
      {
        url: '/api/v1/bank/bill/period-amount',
        method: 'post',
        data,
        headers: {
          'Content-type': 'application/json',
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class LastWeekBillsApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/last-week',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class BillsExcelApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/bank/bill/excel',
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class UserQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/quantities',
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class DeletedUserQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/deleted-quantities',
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class LastWeekUsersApi extends RootApi {
  constructor() {
    super(
      {
        url: '/api/v1/user/last-week',
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class UserWithBillInfoApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/api/v1/bank/user/${id}`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class DownloadBillReportApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: '/api/v1/bank/bill/excel',
        method: 'get',
        responseType: 'blob',
        params: {
          id,
        },
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}

export class BillQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: `/api/v1/bank/bill/quantities`,
        method: 'get',
      },
      { baseURL: process.env.BANK_SERVICE }
    );
  }
}
