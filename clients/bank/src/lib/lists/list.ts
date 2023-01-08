export interface ListObj<T = any> {
  [key: number]: T[];
}

export interface ListInstance<T = any> {
  list: ListObj<T>;
  take: number;
  page: number;
  total: number;
}

export type ListType<T extends ListInstance = ListInstance> = T['list'] extends ListObj<infer C>
  ? C
  : any;

export interface ListInstanceConstructor<K extends ListInstance> {
  new (...args: any[]): ListInstance<ListType<K>>;
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

class MyClass<T> {}

type GetMyClassT<C extends MyClass<any>> = C extends MyClass<infer T> ? T : unknown;
const myInstance = new MyClass<'hello'>();
let x: GetMyClassT<typeof myInstance>; // x: "hello"
