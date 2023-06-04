import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const ResetGlobalCachedKeys = (...keys: CacheKeys[]) =>
  SetMetadata('reset-global-cached-keys', keys);
