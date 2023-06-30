import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const ResetCacheKeys = (...keys: CacheKeys[]) =>
  SetMetadata('reset-cache-keys', keys);
