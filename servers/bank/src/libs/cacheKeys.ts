import { InternalServerErrorException } from '@nestjs/common';
import { CacheKeyRoles, CacheKeyTypes, CacheKeys } from 'src/types';

export function getCacheKeys(): Record<CacheKeys, CacheKeyRoles> {
  return {
    [CacheKeys.BILL]: { name: CacheKeys.BILL, type: CacheKeyTypes.PRIVATE },
    [CacheKeys.BILLS]: { name: CacheKeys.BILLS, type: CacheKeyTypes.PRIVATE },
    [CacheKeys.DELETED_BILL]: { name: CacheKeys.DELETED_BILL, type: CacheKeyTypes.PRIVATE },
    [CacheKeys.DELETED_BILLS]: { name: CacheKeys.DELETED_BILLS, type: CacheKeyTypes.PRIVATE },
    [CacheKeys.QUANTITIES]: { name: CacheKeys.QUANTITIES, type: CacheKeyTypes.PUBLIC },
    [CacheKeys.TOTAL_AMOUNT]: { name: CacheKeys.TOTAL_AMOUNT, type: CacheKeyTypes.PRIVATE },
    [CacheKeys.USER]: { name: CacheKeys.USER, type: CacheKeyTypes.PUBLIC },
  };
}

export function getCacheKeyRoles(cacheKey: CacheKeys): CacheKeyRoles {
  const cacheKeys = getCacheKeys();
  if (!(cacheKey in cacheKeys)) {
    throw new InternalServerErrorException('Could not found the cache key');
  }
  return cacheKeys[cacheKey];
}
