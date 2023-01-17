import { FormMetadataTypes } from '.';

export function CacheInput() {
  return function (target: any, name: string) {
    const cacheInputs: Set<string> =
      Reflect.getMetadata(FormMetadataTypes.CACHE_INPUT, target) || new Set<string>();
    cacheInputs.add(name);
    Reflect.defineMetadata(FormMetadataTypes.CACHE_INPUT, cacheInputs, target);
  };
}
