export interface ListObj<T = any> {
  [key: number]: T[];
}

export interface ListInstance<T = any> {
  list: ListObj<T>;
  take: number;
  page: number;
  total: number;
}

export type ListParams<T> = Pick<ListInstance<T>, 'take' | 'page'>;

export type ListResponse<T extends unknown = unknown> = [T[], number];

export class DefaultList implements ListInstance {
  constructor(
    public list: ListObj = {},
    public total: number = 0,
    public page: number = 1,
    public take: number = 10
  ) {
    this.list = list;
    this.take = take;
    this.page = page;
    this.total = total;
  }
}
