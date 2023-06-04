import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const ResetUniqueCachedKeys = (...keys: CacheKeys[]) =>
  SetMetadata('reset-unique-cached-keys', keys);
