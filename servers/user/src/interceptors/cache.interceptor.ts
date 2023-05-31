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
import { map, of } from 'rxjs';
import { ListDto } from 'src/dtos';
import { getRequest } from 'src/libs';
import { CacheKeys, ListObj } from 'src/types';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    const requiredCacheKey = this.reflector.getAllAndOverride<CacheKeys>(
      'cache-key',
      [context.getHandler(), context.getClass()],
    );

    const request = getRequest(context);

    const originalUrl = request.originalUrl;

    const cacheKey = `${requiredCacheKey}@${originalUrl}`;
    const cachedData = await this.cacheService.get<ListDto>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return handler.handle().pipe(
      map(async (data: ListObj) => {
        await this.cacheService.set(cacheKey, data);
        return data;
      }),
    );
  }
}
