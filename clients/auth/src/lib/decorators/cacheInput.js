import { metadataTypes } from '../types';

export function CacheInput() {
  return function (target, name) {
    const targetConstructor = target.constructor;
    const inputs = Reflect.getMetadata(metadataTypes.CACHE_INPUT, targetConstructor) || [];
    Reflect.defineMetadata(metadataTypes.CACHE_INPUT, [...inputs, name], targetConstructor);
  };
}
