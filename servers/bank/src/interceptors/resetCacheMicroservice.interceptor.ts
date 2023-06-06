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
export class ResetCacheMicroserviceInterceptor implements NestInterceptor {
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
        const requiredResetCachedKeys = this.reflector.getAllAndOverride<
          CacheKeys[] | undefined
        >('reset-cached-keys', [context.getHandler(), context.getClass()]);

        if (requiredResetCachedKeys) {
          const cachedKeys = await this.cacheService.store.keys();
          let findedCachedKeys: Promise<void>[] = [];
          for (const key of cachedKeys)
            requiredResetCachedKeysLoop: for (const resetCachedKey of requiredResetCachedKeys)
              if (key.startsWith(`${resetCachedKey}.${process.env.PORT}`)) {
                findedCachedKeys.push(this.cacheService.del(key));
                break requiredResetCachedKeysLoop;
              }
          if (findedCachedKeys.length) await Promise.all(cachedKeys);
          findedCachedKeys = [];
        }

        return data;
      }),
    );
  }
}
