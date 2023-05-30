import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { map } from 'rxjs';
import { getRequest } from 'src/libs';
import { CacheCategories, ListObj } from 'src/types';

@Injectable()
export class ListCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    const request = getRequest(context);

    const originalUrl = request.originalUrl;

    const cacheKey = `${CacheCategories.USER}@${originalUrl}`;
    const findedCache = await this.cacheService.get<string>(cacheKey);

    if (findedCache) {
      return findedCache;
    }

    return handler.handle().pipe(
      map(async (data: ListObj) => {
        await this.cacheService.set(cacheKey, data);
        return data;
      }),
    );
  }
}
