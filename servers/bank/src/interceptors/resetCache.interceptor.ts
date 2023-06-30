import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, map } from 'rxjs';
import { BaseCacheService } from 'src/services';
import { CacheKeyTypes } from 'src/types';

@Injectable()
export class ResetCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly baseCahceService: BaseCacheService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (data: any) => {
        const cachedKeys = await this.cacheService.store.keys();
        const resetCacheKeys = this.baseCahceService.getResetCacheKeys(context);
        const findedCachedKeys: Promise<void>[] = [];
        let currentCachedKeySign: string | null = null;
        let currentCachedKey: string | null = null;

        for (const cachedKeySign of cachedKeys) {
          [currentCachedKeySign] = cachedKeySign.split('@');
          [, currentCachedKey] = currentCachedKeySign.split('.');

          secondLoop: for (const resetCacheKey of resetCacheKeys) {
            if (currentCachedKey === resetCacheKey) {
              const cachedKeySignType =
                this.baseCahceService.getCacheKeySignType(currentCachedKeySign);
              const resetCacheKeySign =
                cachedKeySignType === CacheKeyTypes.PRIVATE
                  ? this.baseCahceService.getPrivateCacheKeySign(
                      context,
                      resetCacheKey,
                    )
                  : this.baseCahceService.getPublicCacheKeySign(
                      context,
                      resetCacheKey,
                    );
              if (resetCacheKeySign === cachedKeySign) {
                findedCachedKeys.push(this.cacheService.del(cachedKeySign));
              }
              break secondLoop;
            }
          }
        }

        console.log(findedCachedKeys);

        // if (findedCachedKeys.length) Promise.all(findedCachedKeys);
        return data;
      }),
    );
  }
}
