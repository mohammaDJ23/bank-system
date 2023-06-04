import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { map } from 'rxjs';
import { CacheKeys } from 'src/types';

@Injectable()
export class ResetGlobalCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    return handler.handle().pipe(
      map(async (data: any) => {
        const requiredResetGlobalCachedKeys = this.reflector.getAllAndOverride<
          CacheKeys[] | undefined
        >('reset-global-cached-keys', [
          context.getHandler(),
          context.getClass(),
        ]);

        if (requiredResetGlobalCachedKeys) {
          const cacheKeys = await this.cacheService.store.keys();
          let cachedKeys: Promise<void>[] = [];
          for (const key of cacheKeys)
            requiredResetGlobalCachedKeysLoop: for (const resetGlobalCachedKey of requiredResetGlobalCachedKeys)
              if (
                key.startsWith(`${resetGlobalCachedKey}.${process.env.PORT}`)
              ) {
                cachedKeys.push(this.cacheService.del(key));
                break requiredResetGlobalCachedKeysLoop;
              }
          if (cachedKeys.length) await Promise.all(cachedKeys);
          cachedKeys = [];
        }

        return data;
      }),
    );
  }
}
