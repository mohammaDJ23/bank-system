export interface Constructor<T = {}> {
  new (...args: any[]): T;
}

export function copyConstructor<T extends object>(instance: T) {
  const copy = new (instance.constructor as Constructor)(instance);
  return Object.assign(copy, instance);
}
