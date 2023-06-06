import { SetMetadata } from '@nestjs/common';
import { CacheKeyMetadata, CacheKeyOptions, CacheKeys } from 'src/types';

export const CacheKey = (key: CacheKeys, options: CacheKeyOptions = {}) => {
  options.isUnique = options.isUnique || false;
  return SetMetadata<string, CacheKeyMetadata>('cache-key', { key, options });
};
