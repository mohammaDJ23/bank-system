import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const ResetCachedKey = (key: CacheKeys) =>
  SetMetadata('reset-cached-key', key);
