import { metadataTypes } from '../types';

export function getCacheableInputList(target) {
  return Reflect.getMetadata(metadataTypes.CACHE_INPUT, target) || [];
}

export function defineCacheableInput(value, target) {
  Reflect.defineMetadata(metadataTypes.CACHE_INPUT, value, target);
}

export function CacheInput() {
  return function (target, name) {
    const targetConstructor = target.constructor;
    const inputs = getCacheableInputList(targetConstructor);
    defineCacheableInput([...inputs, name], targetConstructor);
  };
}
