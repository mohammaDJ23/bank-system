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
export class ResetCacheInterceptor implements NestInterceptor {
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
        const requiredResetCachedKey =
          this.reflector.getAllAndOverride<CacheKeys>('reset-cached-key', [
            context.getHandler(),
            context.getClass(),
          ]);

        const cacheKeys = await this.cacheService.store.keys();

        for (const cachedKey of cacheKeys)
          if (cachedKey.startsWith(requiredResetCachedKey))
            await this.cacheService.del(cachedKey);

        return data;
      }),
    );
  }
}
