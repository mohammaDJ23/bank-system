import { AxiosRequestConfig } from 'axios';
import {
  ListInstance,
  CreateBill,
  CreateUser,
  UpdateBill,
  UpdateUserByAdmin,
  UpdateUserByUser,
} from '../lib';

export enum Apis {
  CREATE_USER = 'CREATE_USER',
  CREATE_BILL = 'CREATE_BILL',
  UPDATE_USER_BY_ADMIN = 'UPDATE_USER_BY_ADMIN',
  UPDATE_USER_BY_USER = 'UPDATE_USER_BY_USER',
  UPDATE_BILL = 'UPDATE_BILL',
  USERS = 'USERS',
  BILLS = 'BILLS',
  USER = 'USER',
  BILL = 'BILL',
}

export const apis = {
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
  [Apis.USERS](): AxiosRequestConfig {
    return {
      url: '/user/all',
      method: 'get',
    };
  },
  [Apis.BILLS]<T>(params: Pick<ListInstance<T>, 'take' | 'page'>): AxiosRequestConfig {
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
};
