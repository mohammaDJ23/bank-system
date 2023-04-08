import camcase from 'camelcase';

export function camelcase<T extends object = object>(obj: T): T {
  let tempValue = null;

  Object.keys(obj).forEach((key) => {
    tempValue = obj[key];
    delete obj[key];
    obj[camcase(key)] = tempValue;
  });

  return obj;
}
