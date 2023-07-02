import { CallHandler, ExecutionContext, NestInterceptor, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, map } from 'rxjs';
import { getCurrentUser } from 'src/libs';
import { BaseCacheService } from 'src/services';

@Injectable()
export class ResetCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly baseCacheService: BaseCacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (data: any) => {
        const cachedSigns = await this.cacheService.store.keys();
        const resetCacheKeysRoles = this.baseCacheService.getResetCacheKeysRoles(context);
        const curretUser = getCurrentUser(context);
        const currentUserId = curretUser.userServiceId;

        const findedCachedSigns: Promise<void>[] = [];
        for (const cachedSign of cachedSigns) {
          const [sign] = cachedSign.split('@');
          const [cacheKey, userId] = sign.split('.');
          secondLoop: for (const resetCacheKeyRoles of resetCacheKeysRoles) {
            if (cacheKey === resetCacheKeyRoles.name) {
              if (
                (this.baseCacheService.isCacheKeyPrivate(resetCacheKeyRoles.type) && +userId === currentUserId) ||
                this.baseCacheService.isCacheKeyPublic(resetCacheKeyRoles.type)
              ) {
                findedCachedSigns.push(this.cacheService.del(cachedSign));
              }
              break secondLoop;
            }
          }
        }

        return data;
      }),
    );
  }
}
