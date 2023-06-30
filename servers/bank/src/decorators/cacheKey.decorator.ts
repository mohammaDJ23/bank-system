import { SetMetadata } from '@nestjs/common';
import { CacheKeyOptions, CacheKeyTypes, CacheKeys } from 'src/types';

export const CacheKey = (type: CacheKeyTypes, key: CacheKeys) => {
  return SetMetadata<string, CacheKeyOptions>('cache-key', { type, key });
};
