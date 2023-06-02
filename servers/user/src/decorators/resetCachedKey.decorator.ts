import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const ResetCachedKey = (...keys: CacheKeys[]) =>
  SetMetadata('reset-cached-key', keys);
