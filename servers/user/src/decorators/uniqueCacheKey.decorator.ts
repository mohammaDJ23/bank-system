import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const UniqueCacheKey = (key: CacheKeys) =>
  SetMetadata('unique-cache-key', key);
