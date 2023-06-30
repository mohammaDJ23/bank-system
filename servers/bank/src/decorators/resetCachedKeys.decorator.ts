import { SetMetadata } from '@nestjs/common';
import { CacheKeys, ResetCacheTypes } from 'src/types';

export const ResetCachedKeys = (
  metadataKey: ResetCacheTypes,
  ...keys: CacheKeys[]
) => SetMetadata(metadataKey, keys);
