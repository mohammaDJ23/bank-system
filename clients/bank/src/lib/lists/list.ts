export interface ListObj<T = any> {
  [key: number]: T[];
}

export interface ListInstance<T = any> {
  list: ListObj<T>;
  take: number;
  page: number;
}
