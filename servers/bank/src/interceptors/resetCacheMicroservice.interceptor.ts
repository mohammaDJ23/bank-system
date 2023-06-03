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
import { getRequest } from 'src/libs';
import { CacheKeys, DeletedUserObj, UpdatedUserObj } from 'src/types';

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
        const requiredResetCachedKey = this.reflector.getAllAndOverride<
          CacheKeys[]
        >('reset-cached-keys', [context.getHandler(), context.getClass()]);

        if (requiredResetCachedKey.length) {
          const payload = getRequest<UpdatedUserObj | DeletedUserObj>(context);

          const userId = payload.currentUser.id;

          const cacheKeys = await this.cacheService.store.keys();

          let findedCachedKeys: Promise<void>[] = [];

          for (const key of cacheKeys)
            requiredResetCachedKeyLoop: for (const resetCachedKey of requiredResetCachedKey)
              if (
                key.startsWith(
                  `${userId}.${resetCachedKey}.${process.env.PORT}`,
                )
              ) {
                findedCachedKeys.push(this.cacheService.del(key));
                break requiredResetCachedKeyLoop;
              }

          await Promise.all(findedCachedKeys);
          findedCachedKeys = [];
        }

        return data;
      }),
    );
  }
}
