export interface ListObj<T = any> {
  [key: number]: T[];
}

export interface ListInstance<T = any> {
  list: ListObj<T>;
  take: number;
  page: number;
  total: number;
}

export type ListResponse<T extends unknown = unknown> = [T[], number];
