import { metadataTypes } from '../types';

export function CacheInput() {
  return function (target, name) {
    const inputs = Reflect.getMetadata(metadataTypes.CACHE_INPUT, target) || [];
    Reflect.defineMetadata(metadataTypes.CACHE_INPUT, [...inputs, name], target);
  };
}
