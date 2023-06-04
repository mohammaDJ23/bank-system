import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const GlobalCacheKey = (key: CacheKeys) =>
  SetMetadata('global-cache-key', key);
