export interface Constructor {
  new (...args: any[]): {};
}

export function copyConstructor<T extends object>(instance: T) {
  const copy = new (instance.constructor as Constructor)(instance);
  return Object.assign(copy, instance);
}
