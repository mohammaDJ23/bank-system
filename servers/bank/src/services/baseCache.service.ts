import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getCurrentUser, getRequest } from 'src/libs';
import { CacheKeys } from 'src/types';

@Injectable()
export class BaseCacheService {
  constructor(private readonly reflector: Reflector) {}

  getOverrides<T, K = T | undefined>(
    context: ExecutionContext,
    metaDataKey: string,
  ): K {
    return this.reflector.getAllAndOverride<K, string>(metaDataKey, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  getCacheKey(context: ExecutionContext): string {
    const requiredCacheKey = this.getOverrides<string>(context, 'cache-key');
    if (!requiredCacheKey) {
      throw new InternalServerErrorException(
        'No key is provided as a cache key',
      );
    }
    return requiredCacheKey;
  }

  getResetCacheKeys(context: ExecutionContext): CacheKeys[] {
    const requiredResetCachedKeys = this.getOverrides<CacheKeys[]>(
      context,
      'reset-cache-keys',
    );
    if (!requiredResetCachedKeys) {
      throw new InternalServerErrorException(
        'No keys are provided as the reset cache keys',
      );
    }
    return requiredResetCachedKeys;
  }

  isCacheKeyValid(cacheKey: string): boolean {
    return /^\d+\.+[a-zA-Z._-]+\.+\d+$/.test(cacheKey);
  }

  getCacheKeySign(context: ExecutionContext): string {
    const request = getRequest(context);
    const currentUser = getCurrentUser(context);
    const originalUrl = request.originalUrl;
    const userServiceId = currentUser.userServiceId;
    const cacheKey = this.getCacheKey(context);
    return `${userServiceId}.${cacheKey}.${process.env.PORT}@${originalUrl}`;
  }
}
