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
import { getCurrentUser } from 'src/libs';
import { CacheKeys } from 'src/types';

@Injectable()
export class ResetUniqueCacheInterceptor implements NestInterceptor {
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
        const requiredResetUniqueCachedKeys = this.reflector.getAllAndOverride<
          CacheKeys[] | undefined
        >('unique-reset-cached-keys', [
          context.getHandler(),
          context.getClass(),
        ]);

        if (requiredResetUniqueCachedKeys) {
          const currentUser = getCurrentUser(context);
          const userId = currentUser.id;

          const cacheKeys = await this.cacheService.store.keys();
          let cachedKeys: Promise<void>[] = [];
          for (const key of cacheKeys)
            requiredResetUniqueCachedKeysLoop: for (const resetUniqueCachedKey of requiredResetUniqueCachedKeys)
              if (
                key.startsWith(
                  `${userId}.${resetUniqueCachedKey}.${process.env.PORT}`,
                )
              ) {
                cachedKeys.push(this.cacheService.del(key));
                break requiredResetUniqueCachedKeysLoop;
              }
          if (cachedKeys.length) await Promise.all(cachedKeys);
          cachedKeys = [];
        }

        return data;
      }),
    );
  }
}
