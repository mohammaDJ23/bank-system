import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getCurrentUser, getRequest } from 'src/libs';
import { CacheKeyOptions, CacheKeyTypes, CacheKeys } from 'src/types';

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

  getCacheKeyOptions(context: ExecutionContext): CacheKeyOptions {
    const requiredCacheKeyOptions = this.getOverrides<CacheKeyOptions>(
      context,
      'cache-key',
    );
    if (!requiredCacheKeyOptions) {
      throw new InternalServerErrorException(
        'No key is provided as a cache key',
      );
    }
    return requiredCacheKeyOptions;
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

  getCacheKey(context: ExecutionContext): CacheKeys {
    const options = this.getCacheKeyOptions(context);
    return options.key;
  }

  getCacheKeyType(context: ExecutionContext): CacheKeyTypes {
    const options = this.getCacheKeyOptions(context);
    return options.type;
  }

  isPrivateCacheKey(cacheKey: string): boolean {
    return /^\d+\.+[a-zA-Z._-]+\.+\d+$/.test(cacheKey);
  }

  isPublicCacheKey(cacheKey: string): boolean {
    return /^[a-zA-Z._-]+\.+\d+$/.test(cacheKey);
  }

  getCacheKeySign(context: ExecutionContext): string {
    const request = getRequest(context);
    const currentUser = getCurrentUser(context);
    const originalUrl = request.originalUrl;
    const userServiceId = currentUser.userServiceId;
    const cacheKey = this.getCacheKey(context);
    const cacheKeyType = this.getCacheKeyType(context);
    switch (cacheKeyType) {
      case CacheKeyTypes.PRIVATE:
        return `${userServiceId}.${cacheKey}.${process.env.PORT}@${originalUrl}`;
      case CacheKeyTypes.PUBLIC:
        return `${cacheKey}.${process.env.PORT}@${originalUrl}`;
      default:
        throw new InternalServerErrorException(
          'The type of the cache is invalid',
        );
    }
  }
}
