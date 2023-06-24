import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  CACHE_MANAGER,
  Inject,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/entities';
import { getCurrentUser, getRequest } from 'src/libs';
import { CacheKeyMetadata, CacheKeys } from 'src/types';

@Injectable()
export abstract class BaseCache implements NestInterceptor {
  private _context: ExecutionContext;

  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  abstract customeIntercept<T, R>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<R> | Promise<Observable<R>>;

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    this._context = context;
    return this.customeIntercept(context, next);
  }

  getRequest(): Request {
    return getRequest(this._context);
  }

  getCurrentUser(): User {
    return getCurrentUser(this._context);
  }

  getOverrides<T, K = T | undefined>(metaDataKey: string): K {
    return this.reflector.getAllAndOverride<K, string>(metaDataKey, [
      this._context.getHandler(),
      this._context.getClass(),
    ]);
  }

  getCacheKeyOverrides(): CacheKeyMetadata {
    const requiredCacheKey = this.getOverrides<CacheKeyMetadata>('cache-key');
    if (!requiredCacheKey) {
      throw new InternalServerErrorException(
        'No key is provided as a cache key',
      );
    }
    return requiredCacheKey;
  }

  getResetCachedKeysOverrides(): CacheKeys[] {
    const requiredResetCachedKeys =
      this.getOverrides<CacheKeys[]>('reset-cached-keys');
    if (!requiredResetCachedKeys) {
      throw new InternalServerErrorException(
        'No keys are provided as the reset cached keys',
      );
    }
    return requiredResetCachedKeys;
  }

  isGlobalCacheKey(cacheKey: string): boolean {
    return /^[a-zA-Z._-]+\.+\d+$/.test(cacheKey);
  }

  isUniqueCachekey(cacheKey: string): boolean {
    return /^\d+\.+[a-zA-Z._-]+\.+\d+$/.test(cacheKey);
  }

  isCacheKeyValid(cacheKey: string): boolean {
    return this.isGlobalCacheKey(cacheKey) || this.isUniqueCachekey(cacheKey);
  }

  makeUniqueCacheKey(key: string): string {
    const request = this.getRequest();
    const originalUrl = request.originalUrl;
    const currentUser = getCurrentUser(this._context);
    const userId = currentUser.id;
    return `${userId}.${key}.${process.env.PORT}@${originalUrl}`;
  }

  makeGlobalCacheKey(key: string): string {
    const request = this.getRequest();
    const originalUrl = request.originalUrl;
    return `${key}.${process.env.PORT}@${originalUrl}`;
  }

  getCacheKey(): string {
    const key = this.getKey();
    if (this.isUnique()) {
      return this.makeUniqueCacheKey(key);
    } else if (this.isGlobal()) {
      return this.makeGlobalCacheKey(key);
    } else {
      throw new InternalServerErrorException('Invalid options for a cache key');
    }
  }

  getKey(): string {
    const requiredOverrides = this.getCacheKeyOverrides();
    return requiredOverrides.key;
  }

  isUnique(): boolean {
    const requiredOverrides = this.getCacheKeyOverrides();
    return requiredOverrides.options.isUnique;
  }

  isGlobal(): boolean {
    const requiredOverrides = this.getCacheKeyOverrides();
    return requiredOverrides.options.isGlobal;
  }

  async cache(data: unknown): Promise<void> {
    const cacheKey = this.getCacheKey();
    await this.cacheService.set(cacheKey, data);
  }

  async resetCacheKey(): Promise<void> {
    // resetting the global caches
    // resetting the unique caches
    // resetting the global caches with different ids

    const requiredResetCachedKeys = this.getResetCachedKeysOverrides();
    const cachedKeys = await this.cacheService.store.keys();
  }
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    const requiredCacheKey = this.reflector.getAllAndOverride<
      CacheKeyMetadata | undefined
    >('cache-key', [context.getHandler(), context.getClass()]);

    if (requiredCacheKey) {
      const makeCacheKey = (key: string): string => {
        const request = getRequest(context);
        const originalUrl = request.originalUrl;
        const isCacheKeyValid =
          /^\d+\.+[a-zA-Z._-]+\.+\d+$/.test(key) ||
          /^[a-zA-Z._-]+\.+\d+$/.test(key);
        if (isCacheKeyValid) {
          const cacheKey = `${key}@${originalUrl}`;
          return cacheKey;
        } else {
          throw new BadRequestException(
            'Invalid choosen pattern as the cache key.',
          );
        }
      };

      let cacheKey = makeCacheKey(
        `${requiredCacheKey.key}.${process.env.PORT}`,
      );

      if (requiredCacheKey.options.isUnique) {
        const currentUser = getCurrentUser(context);
        const userId = currentUser.id;
        cacheKey = makeCacheKey(
          `${userId}.${requiredCacheKey.key}.${process.env.PORT}`,
        );
      }

      const cachedData = await this.cacheService.get(cacheKey);

      if (cachedData) {
        return of(cachedData);
      } else {
        return handler.handle().pipe(
          map(async (data: any) => {
            await this.cacheService.set(cacheKey, data);
            return data;
          }),
        );
      }
    } else {
      return handler.handle();
    }
  }
}
