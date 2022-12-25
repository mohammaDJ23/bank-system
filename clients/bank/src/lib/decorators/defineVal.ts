import { FormMetadataTypes } from './';

export function DefineVal() {
  return function (target: any, prop: string) {
    const value = Reflect.getMetadata('design:type', target, prop)();
    const cachedValues = Reflect.getMetadata(FormMetadataTypes.VALUES, target) || {};
    const newCachValues = Object.assign(cachedValues, { [prop]: value });
    Reflect.defineMetadata(FormMetadataTypes.VALUES, newCachValues, target);
  };
}
