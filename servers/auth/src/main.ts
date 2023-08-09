import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMqQueue } from './types';
import { swagger } from './libs';
import { NestExpressApplication } from '@nestjs/platform-express';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: RabbitMqQueue.AUTH,
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  app.set('view engine', 'ejs');

  app.enableCors({
    origin: [
      process.env.CLIENT_CONTAINER_URL,
      process.env.CLIENT_AUTH_URL,
      process.env.CLIENT_BANK_URL,
    ],
  });
  swagger(app);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
