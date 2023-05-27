import { UseInterceptors } from '@nestjs/common';
import { TokenizeInterceptor } from 'src/interceptors';

export function TokenizeSerializer() {
  return UseInterceptors(TokenizeInterceptor);
}
