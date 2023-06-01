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
import { getCurrentUser, getRequest } from 'src/libs';
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

        if (requiredResetCachedKey) {
          const currentUser = getCurrentUser(context);

          const userId = currentUser.id;

          const cacheKeys = await this.cacheService.store.keys();
          const targetKey = `${userId}.${requiredResetCachedKey}`;

          for (const key of cacheKeys)
            if (key.startsWith(targetKey)) await this.cacheService.del(key);
        }

        return data;
      }),
    );
  }
}
