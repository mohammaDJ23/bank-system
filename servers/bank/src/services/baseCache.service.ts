import { ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getCurrentUser, getRequest } from 'src/libs';
import { CacheKeyRoles, CacheKeyTypes, CacheKeys } from 'src/types';

@Injectable()
export class BaseCacheService {
  constructor(private readonly reflector: Reflector) {}

  getOverrides<T, K = T | undefined>(context: ExecutionContext, metaDataKey: string): K {
    return this.reflector.getAllAndOverride<K, string>(metaDataKey, [context.getHandler(), context.getClass()]);
  }

  getCacheKeyRoles(context: ExecutionContext): CacheKeyRoles {
    const requiredCacheKeyRoles = this.getOverrides<CacheKeyRoles>(context, 'cache-key');
    if (!requiredCacheKeyRoles) {
      throw new InternalServerErrorException('No key is provided as a cache key');
    }
    return requiredCacheKeyRoles;
  }

  getResetCacheKeysRoles(context: ExecutionContext): CacheKeyRoles[] {
    const requiredResetCachedKeysRoles = this.getOverrides<CacheKeyRoles[]>(context, 'reset-cache-keys');
    if (!requiredResetCachedKeysRoles) {
      throw new InternalServerErrorException('No keys are provided as the reset cache keys');
    }
    return requiredResetCachedKeysRoles;
  }

  getCacheKey(context: ExecutionContext): CacheKeys {
    const options = this.getCacheKeyRoles(context);
    return options.name;
  }

  getCacheKeyType(context: ExecutionContext): CacheKeyTypes {
    const options = this.getCacheKeyRoles(context);
    return options.type;
  }

  isCacheKeyPublic(type: CacheKeyTypes): boolean {
    return type === CacheKeyTypes.PUBLIC;
  }

  isCacheKeyPrivate(type: CacheKeyTypes): boolean {
    return type === CacheKeyTypes.PRIVATE;
  }

  isSignValid(sign: string): boolean {
    // [cache key].[user id].[port]
    return /^[a-zA-Z._-]+\.+\d+\.+\d+$/.test(sign);
  }

  getSign(context: ExecutionContext, cacheKey: CacheKeys) {
    const currentUser = getCurrentUser(context);
    const userServiceId = currentUser.userServiceId;
    return `${cacheKey}.${userServiceId}.${process.env.PORT}`;
  }

  getCacheSign(context: ExecutionContext): string {
    const cacheKey = this.getCacheKey(context);
    const sign = this.getSign(context, cacheKey);
    const request = getRequest(context);
    const originalUrl = request.originalUrl;
    return `${sign}@${originalUrl}`;
  }
}
