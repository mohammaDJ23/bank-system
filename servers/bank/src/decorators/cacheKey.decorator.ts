import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const CacheKey = (key: CacheKeys) => {
  return SetMetadata<string, CacheKeys>('cache-key', key);
};
