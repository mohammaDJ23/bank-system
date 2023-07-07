import {
  CallHandler,
  ExecutionContext,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { map, of } from 'rxjs';
import { getCacheKey, getRequest } from 'src/libs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    const request = getRequest(context);
    const cacheKey = getCacheKey(context);
    const originalUrl = request.originalUrl;
    let cachedData = await this.cacheService.get(cacheKey);

    if (!cachedData) {
      cachedData = { [cacheKey]: {} };
    }

    if (cachedData[cacheKey][originalUrl]) {
      return of(cachedData[cacheKey][originalUrl]);
    } else {
      return handler.handle().pipe(
        map(async (data: any) => {
          if (request.route.isPrivate) {
            cachedData[cacheKey][originalUrl] = data;
            await this.cacheService.set(cacheKey, cachedData);
          }
          return data;
        }),
      );
    }
  }
}
