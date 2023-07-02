import { CallHandler, ExecutionContext, CACHE_MANAGER, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { map, of } from 'rxjs';
import { BaseCacheService } from 'src/services';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly baseCacheService: BaseCacheService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler): Promise<any> {
    const cacheSign = this.baseCacheService.getCacheSign(context);
    const cachedData = await this.cacheService.get(cacheSign);
    if (cachedData) {
      return of(cachedData);
    } else {
      return handler.handle().pipe(
        map(async (data: any) => {
          await this.cacheService.set(cacheSign, data);
          return data;
        }),
      );
    }
  }
}
