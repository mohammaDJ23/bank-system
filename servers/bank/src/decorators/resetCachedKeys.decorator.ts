import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const ResetCachedKeys = (...keys: CacheKeys[]) =>
  SetMetadata('reset-cache-keys', keys);
