import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.RABBITMQ_QUEUE,
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  // becuase of some error about rabbitmq i have been forced to remove it:
  // await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
