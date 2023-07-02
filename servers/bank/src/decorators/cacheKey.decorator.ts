import { SetMetadata } from '@nestjs/common';
import { getCacheKeyRoles } from 'src/libs';
import { CacheKeyRoles, CacheKeys } from 'src/types';

export const CacheKey = (key: CacheKeys) => {
  const cacheKeyRoles = getCacheKeyRoles(key);
  return SetMetadata<string, CacheKeyRoles>('cache-key', cacheKeyRoles);
};
