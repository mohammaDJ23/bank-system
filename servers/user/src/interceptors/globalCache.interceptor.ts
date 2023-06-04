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
import { CacheKeys } from 'src/types';

@Injectable()
export class GlobalCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<any> {
    const requiredGlobalCacheKey = this.reflector.getAllAndOverride<
      CacheKeys | undefined
    >('global-cache-key', [context.getHandler(), context.getClass()]);

    if (requiredGlobalCacheKey) {
      const request = getRequest(context);
      const originalUrl = request.originalUrl;

      const cacheKey = `${requiredGlobalCacheKey}.${process.env.PORT}@${originalUrl}`;
      const cachedData = await this.cacheService.get<ListDto>(cacheKey);

      if (cachedData) {
        return of(cachedData);
      } else {
        return handler.handle().pipe(
          map(async (data: any) => {
            await this.cacheService.set(cacheKey, data);
            return data;
          }),
        );
      }
    } else {
      return handler.handle();
    }
  }
}
