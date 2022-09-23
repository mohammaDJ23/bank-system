import { RpcException } from '@nestjs/microservices';

export function excpetion(error: any) {
  if (error instanceof Object && error.response) {
    throw new RpcException(error);
  }

  throw error;
}
