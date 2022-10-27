import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { swagger } from './libs/swagger';
import { AppModule } from './modules/app.module';
import { RabbitMqQueue } from './types/rabbitmq';

// dymmy change

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: RabbitMqQueue.BANK,
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
