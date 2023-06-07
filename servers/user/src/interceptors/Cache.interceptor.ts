import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  CACHE_MANAGER,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { map, of } from 'rxjs';
import { getCurrentUser, getRequest } from 'src/libs';
import { CacheKeyMetadata } from 'src/types';

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
        console.log(cachedData);
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
