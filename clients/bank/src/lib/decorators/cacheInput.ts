import { FormMetadataTypes } from '.';

type CachedInputs = Set<string>;

export function getCachedInputs(target: any): CachedInputs {
  return Reflect.getMetadata(FormMetadataTypes.CACHE_INPUT, target) || new Set<string>();
}

export function setCacheableInputs(value: CachedInputs, target: any) {
  Reflect.defineMetadata(FormMetadataTypes.CACHE_INPUT, value, target);
}

export function CacheInput() {
  return function (target: any, name: string) {
    const cacheInputs = getCachedInputs(target);
    cacheInputs.add(name);
    setCacheableInputs(cacheInputs, target);
  };
}
