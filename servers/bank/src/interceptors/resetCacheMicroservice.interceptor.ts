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
import { getCacheKeyForMicroservice } from 'src/libs';

@Injectable()
export class ResetCacheMicroserviceInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  async intercept(context: ExecutionContext, handler: CallHandler): Promise<any> {
    return handler.handle().pipe(
      map(async (data: any) => {
        const cacheKeyForMicroservice = getCacheKeyForMicroservice(context);
        const cachedData = await this.cacheService.get(cacheKeyForMicroservice);

        if (cachedData) {
          await this.cacheService.del(cacheKeyForMicroservice);
        }

        return data;
      }),
    );
  }
}
