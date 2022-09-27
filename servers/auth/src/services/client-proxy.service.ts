import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMqServices } from '../types/rabbitmq';

export class ClientProxyServie {
  constructor(
    @Inject(RabbitMqServices.AUTH) private readonly clientProxy: ClientProxy,
  ) {}

  send<T extends unknown, K extends unknown>(
    pattern: string,
    data: K,
  ): Promise<T> {
    return this.clientProxy.send<T, K>(pattern, data).toPromise();
  }
}
