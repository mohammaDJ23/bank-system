import {
  CallHandler,
  ExecutionContext,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { map, of } from 'rxjs';
import { BaseCacheService } from 'src/services';

@Injectable()
export class CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly baseCacheService: BaseCacheService,
  ) {}

  async interceptor(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    const cacheKeySign = this.baseCacheService.getCacheKeySign(context);
    const cachedData = await this.cacheService.get(cacheKeySign);
    if (cachedData) {
      return of(cachedData);
    } else {
      return handler.handle().pipe(
        map(async (data: any) => {
          await this.cacheService.set(cacheKeySign, data);
          return data;
        }),
      );
    }
  }
}
