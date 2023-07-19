import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './modules';
import { RabbitMqQueue } from './types';
import { swagger } from './libs';
import { AuthAdapter } from './adapters';
import './libs/typeormOverwrites';

console.log(
  process.env.DATABASE_HOST,
  process.env.DATABASE_PORT,
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
);

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

  app.enableCors({
    origin: [
      process.env.CLIENT_CONTAINER_URL,
      process.env.CLIENT_AUTH_URL,
      process.env.CLIENT_BANK_URL,
    ],
  });
  swagger(app);
  app.useWebSocketAdapter(new AuthAdapter(app));
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
