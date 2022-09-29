import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RabbitMqQueue } from './types/rabbitmq';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: RabbitMqQueue.REQUEST_TRACKER,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
  );

  await app.listen();
}
bootstrap();
