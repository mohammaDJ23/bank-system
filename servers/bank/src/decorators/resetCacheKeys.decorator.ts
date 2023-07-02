import { SetMetadata } from '@nestjs/common';
import { getCacheKeyRoles } from 'src/libs';
import { CacheKeyRoles, CacheKeys } from 'src/types';

export const ResetCacheKeys = (...keys: CacheKeys[]) => {
  const cacheKeysRoles: CacheKeyRoles[] = [];
  for (const key of keys) {
    cacheKeysRoles.push(getCacheKeyRoles(key));
  }
  return SetMetadata<string, CacheKeyRoles[]>(
    'reset-cache-keys',
    cacheKeysRoles,
  );
};
