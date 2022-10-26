import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMqQueue } from './types/rabbitmq';
import { swagger } from './libs/swagger';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  swagger(app);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
