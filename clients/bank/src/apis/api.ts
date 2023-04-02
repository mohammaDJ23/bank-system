import { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';
import { CreateBill, CreateUser, UpdateBill, UpdateUserByAdmin, UpdateUserByUser, ListParams, BillObj } from '../lib';
import { PeriodAmountFilter } from '../store';
import { RootApiObj } from './resetApi';

export interface IdReq<T = number | string> {
  id: T;
}

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
        url: '/user/create',
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
    super(
      {
        url: '/user/update/admin',
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

export class UpdateUserByUserApi extends RootApi<UpdateUserByUser> {
  constructor(data: UpdateUserByUser) {
    super(
      {
        url: '/user/update',
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
    super(
      {
        url: `/user/all?page=${data.page}&take=${data.take}`,
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export type UsersApiConstructorType = ConstructorParameters<typeof UsersApi>[0] & Pick<RootApi, 'isInitialApi'>;

export class BillsApi<T = any> extends RootApi {
  constructor(data: ListParams<T>) {
    super({
      url: `/bank/bills?page=${data.page}&take=${data.take}`,
      method: 'get',
    });
  }
}

export type BillsApiConstructorType = ConstructorParameters<typeof BillsApi>[0] & Pick<RootApi, 'isInitialApi'>;

export class UserApi extends RootApi {
  constructor(id: number) {
    super(
      {
        url: `/user/${id}`,
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class BillApi extends RootApi {
  constructor(id: string) {
    super({
      url: `/bank/bill/${id}`,
      method: 'get',
    });
  }
}

export class DeleteBillApi extends RootApi<IdReq> {
  constructor(id: string) {
    super({
      url: `/bank/bill/delete`,
      method: 'delete',
      data: { id },
    });
  }
}

export class DeleteUserApi extends RootApi<IdReq> {
  constructor(id: number) {
    super(
      {
        url: `/user/delete`,
        method: 'delete',
        data: { id },
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class TotalAmountApi extends RootApi {
  constructor() {
    super({
      url: '/bank/bill/total-amount',
      method: 'get',
    });
  }
}

export class PeriodAmountApi extends RootApi<PeriodAmountFilter> {
  constructor(data: PeriodAmountFilter) {
    super({
      url: '/bank/bill/period-amount',
      method: 'post',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class BillsLastWeekApi extends RootApi {
  constructor() {
    super({
      url: '/bank/bills/last-week',
      method: 'get',
    });
  }
}

export class BillsMaxAmountsApi extends RootApi<ListParams<BillObj>> {
  constructor(data: ListParams<BillObj>) {
    super({
      url: '/bank/bills/max-amounts',
      method: 'post',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class BillsMinAmountsApi extends RootApi<ListParams<BillObj>> {
  constructor(data: ListParams<BillObj>) {
    super({
      url: '/bank/bills/min-amounts',
      method: 'post',
      data,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
}

export class BillsExcelApi extends RootApi {
  constructor() {
    super({
      url: '/bank/bills/excel',
      method: 'get',
    });
  }
}

export class UserQuantitiesApi extends RootApi {
  constructor() {
    super(
      {
        url: '/user/quantities',
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
        url: '/user/last-week',
        method: 'get',
      },
      { baseURL: process.env.USER_SERVICE }
    );
  }
}

export class UserWithBillInfoApi extends RootApi {
  constructor(id: number) {
    super({
      url: `/bank/user/${id}`,
      method: 'get',
    });
  }
}
