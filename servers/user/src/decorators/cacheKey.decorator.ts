import { SetMetadata } from '@nestjs/common';
import { CacheKeys } from 'src/types';

export const CacheKey = (key: CacheKeys) => SetMetadata('cache-key', key);
