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
import { getCacheKey } from 'src/libs';

@Injectable()
export class ResetCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (data: any) => {
        const cacheKey = getCacheKey(context);
        const cachedData = await this.cacheService.get(cacheKey);

        if (cachedData) {
          await this.cacheService.del(cacheKey);
        }

        return data;
      }),
    );
  }
}
