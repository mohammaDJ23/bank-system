import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RabbitMqQueue } from './types/rabbitmq';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: RabbitMqQueue.USER,
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  app.enableShutdownHooks();
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
