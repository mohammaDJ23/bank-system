import { camelCase } from 'typeorm/util/StringUtils';

export function camelcaseKeys<T = Record<string, any>>(obj: T): T {
  for (let key in obj)
    if (camelcase(key) !== key) {
      obj[camelcase(key)] = obj[key];
      delete obj[key];
    }
  return obj;
}

export function camelcase(str: string): string {
  return camelCase(str);
}
